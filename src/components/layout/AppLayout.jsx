import { useState } from "react";
import { Layout } from "antd";
import { useTranslation } from "react-i18next";
import AppHeader from "./AppHeader.jsx";
import logo from "../../assets/images/logo-white-text.png";
import { useNavigate } from "react-router-dom";

const { Content, Footer, Sider } = Layout;

const AppLayout = function ({
    menu,
    centerChildren,
    showHeaderLogo,
    children,
    ...rest
}) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
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
            {menu && (
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <a
                        onClick={() => navigate("/dashboard")}
                        style={{ width: "100%" }}
                    >
                        <img
                            src={logo}
                            style={{ width: "100%", padding: "1.5rem" }}
                        />
                    </a>
                    {menu}
                </Sider>
            )}
            <Layout>
                <AppHeader showLogo={showHeaderLogo} />
                <Content style={contentStyle} {...rest}>
                    {children}
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    {t("footer-note", {
                        year: new Date().getFullYear(),
                    })}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
