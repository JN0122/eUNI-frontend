import { useState } from "react";
import { Layout, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;

const AppLayout = function ({ Menu, children, ...rest }) {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {Menu && <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical"/>
        {Menu}
      </Sider>}
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ padding: "0 48px" }} {...rest}>
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          System do zarządzania studiami - eUNI ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
