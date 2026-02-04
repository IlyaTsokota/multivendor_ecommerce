import Header from '@/components/dashboard/header/header';
import Sidebar from '@/components/dashboard/sidebar/sidebar';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { FC, ReactNode } from 'react';

interface AdminDashboardLayoutProps {
    children: ReactNode;
}

const AdminDashboardLayout: FC<AdminDashboardLayoutProps> = async ({ children }) => {
    const user = await currentUser();

    if (user?.privateMetadata?.role !== 'ADMIN') {
        redirect('/');
    }

    return (
        <div className="w-full h-full">
            <Sidebar isAdmin />
            <div className="w-full pl-75">
                <Header />
                <div className="w-full mt-18 p-4">{children}</div>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
