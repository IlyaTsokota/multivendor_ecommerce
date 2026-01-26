import ThemeToggle from '@/components/shared/theme-toggle';

export default function Home() {
    return (
        <div>
            <div className="w-100% flex justify-end">
                <ThemeToggle />
            </div>
        </div>
    );
}
