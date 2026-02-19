import CategoryDetails from '@/components/dashboard/forms/category-details';
import DataTable from '@/components/ui/data-table';
import { getAllCategories } from '@/queries/category';
import { Plus } from 'lucide-react';
import { columns } from './columns';

const AdminCategoriesPage = async () => {
    const categories = await getAllCategories();

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <DataTable
            actionButtonText={
                <>
                    <Plus size={15} />
                    Create category
                </>
            }
            modalChildren={<CategoryDetails />}
            newTabLink="/dashboard/admin/categories/new"
            filterValue="name"
            data={categories}
            searchPlaceholder="Search category name..."
            columns={columns}
            heading="Create Category"
            subheading="Manage your product categories and organize your store effectively."
        />
    );
};

export default AdminCategoriesPage;
