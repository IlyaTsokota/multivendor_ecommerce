import { Role } from '@/generated/prisma/enums';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
    const user = await currentUser();

    if (user?.privateMetadata?.role === Role.ADMIN) {
        redirect('/dashboard/admin');
    }

    if (user?.privateMetadata?.role === Role.SELLER) {
        redirect('/dashboard/seller');
    }

    redirect('/');
};

export default DashboardPage;
