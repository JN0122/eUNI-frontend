import {
    EditOutlined,
    LoadingOutlined,
    TableOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { MainMenuProvider } from "../hooks/MainMenuContext.jsx";
import AppLayoutWithMainMenu from "../components/AppLayoutWithMainMenu.jsx";
import { useUser } from "../hooks/UserContext.jsx";
import { useMemo } from "react";

function Dashboard() {
    const { userInfo, hasPermission } = useUser();
    const { t } = useTranslation();

    const items = useMemo(
        () =>
            [
                hasPermission("users:*") && {
                    label: <Link to={"users"}>{t("users")}</Link>,
                    key: "1",
                    path: "users",
                    icon: <UserOutlined />
                },
                hasPermission("schedule:read") && {
                    label: <Link to={"schedule"}>{t("schedule")}</Link>,
                    key: "1",
                    path: "schedule",
                    icon: <TableOutlined />
                },
                hasPermission("schedule:*") && {
                    label: (
                        <Link to={"edit-schedule/classes"}>
                            {t("edit-schedule")}
                        </Link>
                    ),
                    key: "2",
                    path: "edit-schedule",
                    icon: <EditOutlined />
                }
            ].filter(Boolean),
        [hasPermission, t]
    );

    if (!userInfo) {
        return (
            <Spin
                indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 48,
                            color: "white"
                        }}
                        spin
                    />
                }
                fullscreen
            />
        );
    }

    return (
        <MainMenuProvider items={items}>
            <AppLayoutWithMainMenu />
        </MainMenuProvider>
    );
}

export default Dashboard;
