import AppLayout from "../components/layout/AppLayout.jsx";
import { LoadingOutlined, PieChartOutlined } from "@ant-design/icons";
import SiderMenu, { parseMenuItem } from "../components/layout/SiderMenu.jsx";
import { Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../context/AuthContext.jsx";
import { UserRole } from "../enums/userRoles.js";

function Dashboard() {
    const { userInfo } = useAuth();

    if (!userInfo) {
        return (
            <Spin
                indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 48,
                            color: "white",
                        }}
                        spin
                    />
                }
                fullscreen
            />
        );
    }

    let items = [];

    switch (userInfo.role) {
        case UserRole.SuperAdmin:
            items = [parseMenuItem("Super admin", "1", <PieChartOutlined />)];
            break;
        case UserRole.Student:
            items = [parseMenuItem("Student", "1", <PieChartOutlined />)];
            break;
        case UserRole.Lecturer:
            items = [parseMenuItem("Lecturer", "1", <PieChartOutlined />)];
            break;
        case UserRole.Admin:
            items = [parseMenuItem("Admin", "1", <PieChartOutlined />)];
            break;
    }

    const AppLayoutSider = <SiderMenu theme="dark" items={items} />;

    return (
        <AppLayout menu={AppLayoutSider}>
            <Outlet />
        </AppLayout>
    );
}

export default Dashboard;
