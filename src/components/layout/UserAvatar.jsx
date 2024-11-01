import { Avatar, Dropdown, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";

function UserAvatar() {
    const { logout, userInfo } = useAuth();
    const { t } = useTranslation();

    if (!userInfo) {
        return (
            <Skeleton
                avatar
                active
                style={{ display: "block", height: "40px" }}
            />
        );
    }

    let items = [
        {
            label: `${userInfo.firstname} ${userInfo.lastname}`,
            key: "0",
            disabled: true,
        },
        {
            type: "divider",
        },
        {
            label: <Link to="/profile/info">{t("profile")}</Link>,
            key: "1",
        },
        {
            label: <a onClick={() => logout()}>{t("logout")}</a>,
            key: "2",
        },
    ];

    return (
        <a onClick={(e) => e.preventDefault()}>
            <Dropdown
                menu={{
                    items,
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
