'use client';

import { Category } from '@/generated/prisma/client';
import { FC, useEffect } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { CategoryFormSchema } from '@/lib/schemas';
import { AlertDialog } from '@/components/ui/alert-dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import ImageUpload from '../shared/image-upload';
import { upsertCategory } from '@/queries/category';
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface CategoryDetailsProps {
    data?: Category;
}

type FormValues = z.infer<typeof CategoryFormSchema>;

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
    const router = useRouter();

    const form = useForm<FormValues>({
        mode: 'onChange',
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            name: data?.name ?? '',
            url: data?.url ?? '',
            featured: data?.featured ?? false,
            image: data?.image ? [{ url: data.image }] : [],
        },
    });

    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name ?? '',
                url: data.url ?? '',
                featured: data.featured ?? false,
                image: data.image ? [{ url: data.image }] : [],
            });
        }
    }, [data, form]);

    async function handleSubmit(values: FormValues) {
        try {
            const response = await upsertCategory({
                id: data?.id ? data.id : uuid(),
                name: values.name,
                url: values.url,
                featured: !!values.featured,
                image: values.image[0].url,
                createdAt: data?.createdAt ?? new Date(),
                updatedAt: new Date(),
            });

            toast.success(
                data?.id
                    ? 'Category has been updated.'
                    : `Congratulations! '${response?.name}' is now created.`,
            );

            if (data?.id) {
                router.refresh();
            } else {
                router.push('/dashboard/admin/categories');
            }
        } catch (error) {
            console.log(error);
            toast.error('Oops!', {
                description: error instanceof Error ? error.message : 'Something went wrong.',
            });
        }
    }

    return (
        <AlertDialog>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Category Details</CardTitle>
                    <CardDescription>
                        {data?.id
                            ? `Update ${data?.name} category details.`
                            : 'Lets create a category. You can edit category later from the category page.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="form-rhf-demo"
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="mt-4"
                    >
                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="image"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <ImageUpload
                                                type="profile"
                                                value={(field.value ?? []).map((img) => img.url)}
                                                disabled={isLoading}
                                                onChange={(url) => field.onChange([{ url }])}
                                                onRemove={(url) =>
                                                    field.onChange([
                                                        ...field.value.filter(
                                                            (current) => current.url !== url,
                                                        ),
                                                    ])
                                                }
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </FieldContent>
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="flex-1">
                                        <FieldLabel htmlFor={field.name}>Category name</FieldLabel>
                                        <Input
                                            {...field}
                                            placeholder="Name"
                                            id={field.name}
                                            disabled={isLoading}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="url"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="flex-1">
                                        <FieldLabel htmlFor={field.name}>Category url</FieldLabel>
                                        <Input
                                            {...field}
                                            placeholder="/category-url"
                                            id={field.name}
                                            disabled={isLoading}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="featured"
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        orientation="horizontal"
                                    >
                                        <Checkbox
                                            aria-invalid={fieldState.invalid}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isLoading}
                                        />
                                        <FieldContent>
                                            <FieldLabel>Featured</FieldLabel>
                                            <FieldDescription>
                                                Featured categories will be displayed on the
                                                homepage.
                                            </FieldDescription>
                                        </FieldContent>
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button disabled={isLoading} type="submit" form="form-rhf-demo">
                            {isLoading
                                ? 'Saving...'
                                : data?.id
                                  ? 'Save changes'
                                  : 'Create category'}
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </AlertDialog>
    );
};

export default CategoryDetails;
