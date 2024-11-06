import { Menu } from "antd";

function SiderMenu({ fullHeight, activeKey, ...rest }) {
    return (
        <Menu
            style={fullHeight && { height: "100%" }}
            defaultSelectedKeys={[activeKey]}
            mode="inline"
            {...rest}
        />
    );
}

export default SiderMenu;
