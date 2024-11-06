import {
    LoadingOutlined,
    PieChartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../context/AuthContext.jsx";
import { UserRole } from "../enums/userRoles.js";
import { useTranslation } from "react-i18next";
import { MainMenuProvider } from "../context/MainMenuContext.jsx";
import AppLayoutWithMainMenu from "../components/AppLayoutWithMainMenu.jsx";

function Dashboard() {
    const { userInfo } = useAuth();
    const { t } = useTranslation();

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
                    label: <Link to={"users"}>{t("users")}</Link>,
                    key: "1",
                    path: "users",
                    icon: <UserOutlined />,
                },
            ];
            break;
        case UserRole.Student:
            items = [
                {
                    label: "Student",
                    key: "1",
                    path: "student",
                    icon: <PieChartOutlined />,
                },
            ];
            break;
        case UserRole.Lecturer:
            items = [
                {
                    label: "Lecturer",
                    key: "1",
                    path: "lecturer",
                    icon: <PieChartOutlined />,
                },
            ];
            break;
        case UserRole.Admin:
            items = [
                {
                    label: "Admin",
                    key: "1",
                    path: "admin",
                    icon: <PieChartOutlined />,
                },
            ];
            break;
    }

    return (
        <MainMenuProvider items={items}>
            <AppLayoutWithMainMenu />
        </MainMenuProvider>
    );
}

export default Dashboard;
