import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Toaster } from "@/components/ui/sonner";

export function DashboardLayout({ children, breadcrumbs }: { children: React.ReactNode, breadcrumbs?: string[] }) {
    return (
        <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
            <Sidebar className="hidden md:flex" />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header breadcrumbs={breadcrumbs} />
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
            <Toaster position="bottom-right" />
        </div>
    );
}
