import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Layout, theme } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

function AppHeader({ showOnlyBar }) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate();

    function onAvatarClick(e) {
        e.preventDefault();

        navigate("/profile");
    }

    let content;
    if (!showOnlyBar) {
        content = (
            <Flex
                justify="space-between"
                style={{ flexDirection: "row-reverse" }}
            >
                <a onClick={onAvatarClick}>
                    <Avatar
                        size={32}
                        icon={<UserOutlined />}
                        style={{ margin: "0 1rem" }}
                    />
                </a>
            </Flex>
        );
    }

    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
        >
            {content}
        </Header>
    );
}

export default AppHeader;
