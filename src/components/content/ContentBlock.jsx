import { Layout, theme } from "antd";
import Breadcrumbs from "./Breadcrumbs.jsx";
import { useMediaQuery } from "react-responsive";

const { Content, Sider } = Layout;

function ContentBlock({ menu, breadcrumbs, children, ...rest }) {
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    const isSmallScreen = useMediaQuery({ maxWidth: 600 });
    const isMediumScreen = useMediaQuery({ minWidth: 601, maxWidth: 1200 });

    let contentStyle = {
        padding: isSmallScreen
            ? "0.25rem"
            : isMediumScreen
              ? "1rem"
              : menu
                ? "1.5rem"
                : "3rem",
        minHeight: 280
    };

    return (
        <>
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            <Layout
                style={{
                    marginTop: "1rem",
                    padding: "1.5em",
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    overflow: "scroll"
                }}
            >
                {menu && (
                    <Sider
                        style={{
                            background: colorBgContainer
                        }}
                        width={"auto"}
                    >
                        {menu}
                    </Sider>
                )}
                <Content style={contentStyle} {...rest}>
                    {children}
                </Content>
            </Layout>
        </>
    );
}

export default ContentBlock;
