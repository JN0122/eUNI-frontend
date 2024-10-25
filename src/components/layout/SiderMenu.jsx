import {Menu} from "antd";

export function parseMenuItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

function SiderMenu({fullHeight, ...rest}){
    return <Menu
        style={fullHeight && {height: "100%"}}
        defaultSelectedKeys={["1"]}
        mode="inline"
        {...rest}/>;
}

export default SiderMenu;