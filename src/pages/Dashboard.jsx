import {
    LoadingOutlined,
    TableOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../context/AuthContext.jsx";
import UserRole from "../enums/userRoles.js";
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
        case UserRole.Admin:
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
                    label: <Link to={"schedule"}>{t("schedule")}</Link>,
                    key: "1",
                    path: "schedule",
                    icon: <TableOutlined />,
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
