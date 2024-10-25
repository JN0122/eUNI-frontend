import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Layout, theme } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/images/logo.png";

const { Header } = Layout;

function AppHeader({ showLogo, showUser, additionalUserElement, ...rest }) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate();

    function onAvatarClick(e) {
        e.preventDefault();
        navigate("/profile");
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
                        <a onClick={onAvatarClick}>
                            <Avatar
                                size={32}
                                icon={<UserOutlined />}
                                style={{ margin: "0 1rem" }}
                            />
                        </a>
                    </Flex>
                )}
                {showLogo && (
                    <img
                        src={logo}
                        style={{ height: "3rem", margin: "0 1rem" }}
                    />
                )}
            </Flex>
        </Header>
    );
}

export default AppHeader;
