import type { ReactNode } from "react";
import DashboardSidebar from "@/components/layout/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/layout/dashboard/DashboardHeader";
import "@/assets/styles/scss/layout/page.scss";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <main className="flex flex-row h-screen w-full">
            <DashboardSidebar />
            <section className="custom-container dashboard-content flex flex-1 min-w-0 flex-col py-[30px] px-[40px]">
                <DashboardHeader />
                {children}
            </section>
        </main>
    );
}

