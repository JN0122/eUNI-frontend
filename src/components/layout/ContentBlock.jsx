import { Layout, theme } from "antd";
import Breadcrumbs from "./Breadcrumbs.jsx";

const { Content, Sider } = Layout;

function ContentBlock({ menu, breadcrumbs, children, ...rest }) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            <Layout
                style={{
                    marginTop: "1rem",
                    padding: "1.5em",
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                {menu && (
                    <Sider
                        style={{
                            background: colorBgContainer,
                        }}
                        width={"auto"}
                    >
                        {menu}
                    </Sider>
                )}
                <Content
                    style={{ padding: "0 1.5rem", minHeight: 280 }}
                    {...rest}
                >
                    {children}
                </Content>
            </Layout>
        </>
    );
}

export default ContentBlock;
