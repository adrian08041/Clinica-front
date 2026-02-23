import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PatientsSection } from "@/components/dashboard/patients-section";

export default function PacientesPage() {
    return (
        <DashboardLayout>
            <PatientsSection />
        </DashboardLayout>
    );
}
