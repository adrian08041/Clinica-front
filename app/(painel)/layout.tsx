import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}
