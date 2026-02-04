import { Role, User } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);
        const eventType = evt.type;
        console.log('Webhook payload:', evt.data);

        if (eventType === 'user.created' || eventType === 'user.updated') {
            const user: Omit<User, 'createdAt' | 'updatedAt'> = {
                id: evt.data.id,
                email: evt.data.email_addresses[0].email_address,
                name: evt.data.first_name + ' ' + evt.data.last_name,
                picture: evt.data.image_url,
                role: (evt.data.private_metadata?.role as Role) || Role.USER,
            };

            const dbUser = await db.user.upsert({
                where: { email: user.email },
                update: user,
                create: user,
            });

            const clerkClientInstance = await clerkClient();

            await clerkClientInstance.users.updateUser(dbUser.id, {
                privateMetadata: {
                    role: dbUser.role,
                },
            });
        }

        if (eventType === 'user.deleted') {
            const { id } = evt.data;

            await db.user.deleteMany({
                where: { id },
            });
        }

        return new Response('Webhook received', { status: 200 });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error verifying webhook', { status: 400 });
    }
}
