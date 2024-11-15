import { useState } from "react";
import { Button, ConfigProvider, Layout, theme } from "antd";
import { useTranslation } from "react-i18next";
import AppHeader from "./AppHeader.jsx";
import logo from "../assets/images/logo-white-text.png";
import { useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

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
    const isSmallScreen = useMediaQuery({ maxWidth: 600 });
    const isMediumScreen = useMediaQuery({ minWidth: 601, maxWidth: 1200 });

    const {
        token: { colorBgContainer }
    } = theme.useToken();

    const closeMenuElement = (
        <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                backgroundColor: colorBgContainer
            }}
        />
    );
    let contentStyle = {
        padding: isSmallScreen ? "0 1rem" : isMediumScreen ? "0 2rem" : "0 3rem"
    };

    if (centerChildren) {
        contentStyle = {
            ...contentStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        };
    }

    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        zeroTriggerWidth: 1,
                        zeroTriggerHeight: 1,
                        triggerBg: "red"
                    }
                }
            }}
        >
            <Layout style={{ minHeight: "100vh" }}>
                {menu && (
                    <>
                        <Sider
                            breakpoint="lg"
                            collapsedWidth="0"
                            collapsed={collapsed}
                            onCollapse={(value) => setCollapsed(value)}
                            trigger={null}
                        >
                            <a
                                onClick={() => navigate("/")}
                                style={{ width: "100%" }}
                            >
                                <img
                                    src={logo}
                                    style={{ width: "100%", padding: "1.5rem" }}
                                />
                            </a>
                            {menu}
                        </Sider>
                    </>
                )}
                <Layout>
                    <AppHeader
                        showLogo={showHeaderLogo}
                        closeMenuElement={closeMenuElement}
                    />
                    <Content style={contentStyle} {...rest}>
                        {children}
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        {t("footer-note", {
                            year: new Date().getFullYear()
                        })}
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AppLayout;
