import { SideBar } from "../organisms/common/SideBar";

export const DashboardTemplate = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SideBar />
            <div style={{ flex: 1, padding: '24px', backgroundColor: '#f0f2f5' }}>
                {children}
            </div>
        </div>
    );
};
