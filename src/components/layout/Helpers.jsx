import {Breadcrumb} from "antd";

export function Breadcrumbs({breadcrumbs, ...rest}) {
    return <Breadcrumb style={{ marginTop: "1em" }} items={[...breadcrumbs]} {...rest} />;
}
