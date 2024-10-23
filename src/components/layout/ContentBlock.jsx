import { Layout, theme } from "antd";
import {Breadcrumbs} from "./Helpers.jsx";

const { Content, Sider } = Layout;

function ContentBlock({Menu, breadcrumbs, children, ...rest}){
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return <>
        {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs}/>}
        <Layout
            style={{
                marginTop: "1rem",
                padding: "1.5em",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            {Menu && <Sider style={{background: colorBgContainer}} width={200}>
                {Menu}
            </Sider>}
            <Content style={{ padding: "0 1.5rem", minHeight: 280 }} {...rest}>
                {children}
            </Content>
        </Layout>
    </>
}

export default ContentBlock;