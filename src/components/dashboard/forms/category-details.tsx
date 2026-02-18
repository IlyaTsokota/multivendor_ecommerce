'use client';

import { Category } from '@/generated/prisma/client';
import { FC, useEffect } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CategoryFormSchema } from '@/lib/schemas';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface CategoryDetailsProps {
    data?: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
    const form = useForm<z.input<typeof CategoryFormSchema>>({
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

    const handleSubmit = async (values: z.input<typeof CategoryFormSchema>) => {
        console.log(values);
    };

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
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="my-4 space-y-4">
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Category name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Category url</FormLabel>
                                        <FormControl>
                                            <Input placeholder="/category-url" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-0">
                                            <FormLabel>Featured</FormLabel>
                                            <FormDescription>
                                                Featured categories will be displayed on the
                                                homepage.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isLoading} type="submit">
                                {isLoading
                                    ? 'Saving...'
                                    : data?.id
                                      ? 'Save changes'
                                      : 'Create category'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AlertDialog>
    );
};

export default CategoryDetails;
