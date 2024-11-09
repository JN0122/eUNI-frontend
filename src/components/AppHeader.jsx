import { Flex, Layout, theme } from "antd";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar.jsx";

const { Header } = Layout;

function AppHeader({ showLogo, additionalUserElement, ...rest }) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { isAuthenticated } = useAuth();

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
                    flexDirection: isAuthenticated && "row-reverse",
                    height: "100%",
                }}
                gap={"1rem"}
            >
                {isAuthenticated && (
                    <Flex gap={"0.5rem"} align="center">
                        {additionalUserElement}
                        <UserAvatar />
                    </Flex>
                )}
                {showLogo && (
                    <Link to="/" style={{ height: "3rem" }}>
                        <img
                            src={logo}
                            style={{ height: "100%", margin: "0 1rem" }}
                        />
                    </Link>
                )}
            </Flex>
        </Header>
    );
}

export default AppHeader;
