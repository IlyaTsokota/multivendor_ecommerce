'use server';

import { Category } from '@/generated/prisma/client';
import { Role } from '@/generated/prisma/enums';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { refresh, revalidatePath } from 'next/cache';

export const upsertCategory: (category: Category) => Promise<Category> = async (category) => {
    try {
        const user = await currentUser();

        if (!user) {
            throw new Error('Unauthorized.');
        }

        if (user?.privateMetadata?.role !== Role.ADMIN) {
            throw new Error('Unauthorized Access: Admin role required for Entry.');
        }

        if (!category) throw new Error('Category data is required.');

        const existingCategory = await db.category.findFirst({
            where: {
                AND: [
                    {
                        OR: [{ url: category.url }, { name: category.name }],
                    },
                    {
                        NOT: {
                            id: category.id,
                        },
                    },
                ],
            },
        });

        if (existingCategory) {
            let errorMessage = 'A category with the same ';
            if (existingCategory.url === category.url) {
                errorMessage += 'URL';
            } else if (existingCategory.name === category.name) {
                errorMessage += 'name';
            }
            errorMessage += ' already exists.';

            throw new Error(errorMessage);
        }

        const categoryDetails: Category = await db.category.upsert({
            where: { id: category.id },
            update: category,
            create: category,
        });

        if (category.id) {
            refresh();
        }

        revalidatePath('/dashboard/admin/categories');

        return categoryDetails;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllCategories: () => Promise<Category[]> = async () => {
    try {
        const categories = await db.category.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
        });
        return categories;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// export const getAllCategoriesForCategory = async (categoryId: string) => {
//     const subCategories = await db.subCategory.findMany({
//         where: {
//             categoryId,
//         },
//         orderBy: {
//             updatedAt: 'desc',
//         },
//     });
//     return subCategories;
// };

export const getCategory = async (categoryId: string) => {
    if (!categoryId) throw new Error('Please provide category ID.');

    const category = await db.category.findUnique({
        where: {
            id: categoryId,
        },
    });
    return category;
};

export const deleteCategory = async (categoryId: string) => {
    const user = await currentUser();

    if (!user) throw new Error('Unauthenticated.');

    if (user.privateMetadata.role !== 'ADMIN')
        throw new Error('Unauthorized Access: Admin Privileges Required for Entry.');

    if (!categoryId) throw new Error('Please provide category ID.');

    const response = await db.category.delete({
        where: {
            id: categoryId,
        },
    });
    return response;
};
