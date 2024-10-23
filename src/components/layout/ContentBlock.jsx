import {Layout, theme} from "antd";
import {Breadcrumbs} from "./LayoutHelper.jsx";

const { Content, Sider } = Layout;

function ContentBlock({Menu, breadcrumbs, children, ...rest}){
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Layout
            style={{
                padding: "24px 0",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            {Menu && <Sider style={{background: colorBgContainer}} width={200}>
                {Menu}
            </Sider>}
            <Content style={{ padding: "0 24px", minHeight: 280 }} {...rest}>
                {children}
            </Content>
        </Layout>
    </>
}

export default ContentBlock;