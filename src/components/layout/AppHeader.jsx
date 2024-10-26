import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Flex, Layout, theme } from "antd";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Header } = Layout;

function AppHeader({ showLogo, additionalUserElement, ...rest }) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const showUser = !!user;
    let items = [];

    if (showUser) {
        if (!user.firstname || !user.lastname) {
            throw new Error("User not found.");
        }
        items = [
            {
                label: `${user.firstname} ${user.lastname}`,
                key: "0",
                disabled: true,
            },
            {
                type: "divider",
            },
            {
                label: (
                    <a onClick={() => navigate("/profile")}>{t("profile")}</a>
                ),
                key: "1",
            },
            {
                label: <a onClick={() => logout()}>{t("logout")}</a>,
                key: "2",
            },
        ];
    }

    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
            {...rest}
        >
            <Flex
                justify="space-between"
                align="center"
                style={{
                    flexDirection: showUser && "row-reverse",
                    height: "100%",
                }}
                gap={"1rem"}
            >
                {showUser && (
                    <Flex gap={"0.5rem"} align="center">
                        {additionalUserElement}
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
                                    size={32}
                                    icon={<UserOutlined />}
                                    style={{ margin: " 1rem" }}
                                />
                            </Dropdown>
                        </a>
                    </Flex>
                )}
                {showLogo && (
                    <a onClick={() => navigate("/")} style={{ height: "3rem" }}>
                        <img
                            src={logo}
                            style={{ height: "100%", margin: "0 1rem" }}
                        />
                    </a>
                )}
            </Flex>
        </Header>
    );
}

export default AppHeader;
