import { Layout, theme } from "antd";

const { Header } = Layout;

function AppHeader() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
        ></Header>
    );
}

export default AppHeader;
