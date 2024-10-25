import { useState } from "react";
import { Layout } from "antd";
import { useTranslation } from "react-i18next";
import AppHeader from "./AppHeader.jsx";

const { Content, Footer, Sider } = Layout;

const AppLayout = function ({
    Menu,
    centerChildren,
    showHeaderLogo,
    showHeaderUser,
    children,
    ...rest
}) {
    const [collapsed, setCollapsed] = useState(false);

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
                <AppHeader
                    showLogo={showHeaderLogo}
                    showUser={showHeaderUser}
                />
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
