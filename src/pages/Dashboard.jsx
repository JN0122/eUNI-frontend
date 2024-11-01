import AppLayout from "../components/layout/AppLayout.jsx";
import { LoadingOutlined, PieChartOutlined } from "@ant-design/icons";
import SiderMenu from "../components/layout/SiderMenu.jsx";
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
            items = [
                {
                    label: "Super admin",
                    key: "1",
                    icon: <PieChartOutlined />,
                },
            ];
            break;
        case UserRole.Student:
            items = [
                {
                    label: "Student",
                    key: "1",
                    icon: <PieChartOutlined />,
                },
            ];
            break;
        case UserRole.Lecturer:
            items = [
                {
                    label: "Lecturer",
                    key: "1",
                    icon: <PieChartOutlined />,
                },
            ];
            break;
        case UserRole.Admin:
            items = [
                {
                    label: "Admin",
                    key: "1",
                    icon: <PieChartOutlined />,
                },
            ];
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
