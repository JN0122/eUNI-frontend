import {
    EditOutlined,
    LoadingOutlined,
    TableOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import USER_ROLE from "../enums/userRoles.js";
import { useTranslation } from "react-i18next";
import { MainMenuProvider } from "../context/MainMenuContext.jsx";
import AppLayoutWithMainMenu from "../components/AppLayoutWithMainMenu.jsx";
import { useUser } from "../context/UserContext.jsx";

function Dashboard() {
    const { userInfo } = useUser();
    const { t } = useTranslation();

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

    let items = [];

    switch (userInfo.roleId) {
        case USER_ROLE.Admin:
            items = [
                {
                    label: <Link to={"users"}>{t("users")}</Link>,
                    key: "1",
                    path: "users",
                    icon: <UserOutlined />
                }
            ];
            break;
        case USER_ROLE.Student:
            items = [
                {
                    label: <Link to={"schedule"}>{t("schedule")}</Link>,
                    key: "1",
                    path: "schedule",
                    icon: <TableOutlined />
                },
                {
                    label: (
                        <Link to={"edit-schedule"}>{t("edit-schedule")}</Link>
                    ),
                    key: "2",
                    path: "edit-schedule",
                    icon: <EditOutlined />
                }
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
