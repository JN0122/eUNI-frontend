import {Breadcrumb} from "antd";

export function Breadcrumbs({breadcrumbs, ...rest}) {
    return <Breadcrumb style={{ margin: "16px 0" }} items={[...breadcrumbs]} {...rest} />;
}
