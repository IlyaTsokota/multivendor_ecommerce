import ThemeToggle from '@/components/shared/theme-toggle';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
    return (
        <div className="p-5">
            <div className="w-100% flex gap-x-5 justify-end">
                <UserButton />
                <ThemeToggle />
            </div>
            <h1 className="mt-10 text-3xl font-barlow text-blue-500">
                Welcome to the Multi-vendor E-commerce Platform!
            </h1>
        </div>
    );
}
