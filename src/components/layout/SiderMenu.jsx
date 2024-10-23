import {Menu} from "antd";

function SiderMenu({fullHeight, ...rest}){
    return <Menu
        style={fullHeight && {height: "100%"}}
        defaultSelectedKeys={["1"]}
        mode="inline"
        {...rest}/>;
}

export default SiderMenu;