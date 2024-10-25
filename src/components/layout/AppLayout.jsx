import { useState } from "react";
import { Layout, theme } from "antd";
import { useTranslation } from "react-i18next";

const { Header, Content, Footer, Sider } = Layout;

const AppLayout = function ({ Menu, centerChildren, children, ...rest }) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { t } = useTranslation();
    let contentStyle = {
        padding: "0 3rem",
    };

    if (centerChildren) {
        contentStyle = {
            ...contentStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        };
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {Menu && (
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <div className="demo-logo-vertical" />
                    {Menu}
                </Sider>
            )}
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={contentStyle} {...rest}>
                    {children}
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    {t("footer-note")} - eUNI ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
