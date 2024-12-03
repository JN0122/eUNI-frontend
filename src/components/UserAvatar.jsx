import { Avatar, Dropdown, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/AuthContext.jsx";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useUser } from "../hooks/UserContext.jsx";

function UserAvatar() {
    const { logout } = useAuth();
    const { userInfo } = useUser();
    const { t } = useTranslation();

    const items = useMemo(
        () => [
            {
                label: `${userInfo?.firstName} ${userInfo?.lastName}`,
                key: "0",
                disabled: true
            },
            {
                type: "divider"
            },
            {
                label: <Link to="/profile/info">{t("profile")}</Link>,
                key: "1"
            },
            {
                label: <a onClick={() => logout()}>{t("logout")}</a>,
                key: "2"
            }
        ],
        [userInfo, t, logout]
    );
    if (!userInfo) {
        return (
            <Skeleton
                avatar
                active
                style={{ display: "block", height: "40px" }}
            />
        );
    }

    return (
        <a onClick={(e) => e.preventDefault()}>
            <Dropdown
                menu={{
                    items
                }}
                trigger={["click"]}
                placement="bottomRight"
                arrow
            >
                <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    style={{ margin: " 1rem" }}
                />
            </Dropdown>
        </a>
    );
}

export default UserAvatar;
