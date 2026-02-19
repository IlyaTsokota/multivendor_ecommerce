import { getAllCategories } from '@/queries/category';

const AdminCategoriesPage = async () => {
    const categories = await getAllCategories();

    if (!categories || categories.length === 0) {
        return null;
    }

    return <div>Admin Categories Page</div>;
};

export default AdminCategoriesPage;
