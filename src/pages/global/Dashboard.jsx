import {
    CalendarOutlined,
    EditOutlined,
    LoadingOutlined,
    TableOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { MainMenuProvider } from "../../hooks/useMainMenu.jsx";
import AppLayoutWithMainMenu from "../../components/layout/AppLayoutWithMainMenu.jsx";
import { useUser } from "../../hooks/useUser.jsx";
import { useMemo } from "react";
import GraduationCapFilled from "../../components/icons/GraduationCapFilled.jsx";

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
                    key: "2",
                    path: "schedule",
                    icon: <TableOutlined />
                },
                hasPermission("schedule:*") && {
                    label: (
                        <Link to={"edit-schedule/classes"}>
                            {t("edit-schedule")}
                        </Link>
                    ),
                    key: "3",
                    path: "edit-schedule",
                    icon: <EditOutlined />
                },
                hasPermission("year-organization:*") && {
                    label: (
                        <Link to={"year-organization"}>
                            {t("year-organization")}
                        </Link>
                    ),
                    key: "4",
                    path: "year-organization",
                    icon: <CalendarOutlined />
                },
                hasPermission("fields-of-study:*") && {
                    label: (
                        <Link to={"fields-of-study"}>
                            {t("fields-of-study")}
                        </Link>
                    ),
                    key: "5",
                    path: "year-organization",
                    icon: <GraduationCapFilled />
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
