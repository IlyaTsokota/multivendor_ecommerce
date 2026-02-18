import * as z from 'zod';

export const CategoryFormSchema = z.object({
    name: z
        .string('Category name must be a string')
        .min(1, 'Category name is required')
        .max(50, 'Category name must be less than 50 characters')
        .regex(/^[a-zA-Z0-9\s]+$/, 'Category name can only contain letters, numbers, and spaces'),

    image: z
        .object({
            url: z.string(),
        })
        .array()
        .length(1, 'At least one image is required'),

    url: z
        .string('Category url must be a string')
        .min(1, 'Category url is required')
        .max(50, 'Category url must be less than 50 characters')
        .regex(/^(\/|\.\/|\.\.\/)/, {
            message: 'Invalid relative URL',
        }),

    featured: z.boolean().default(false),
});
