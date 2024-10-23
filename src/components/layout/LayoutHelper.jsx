import {Breadcrumb} from "antd";

export function Breadcrumbs({breadcrumbs, ...rest}) {
    return <Breadcrumb style={{ margin: "16px 0" }} {...rest}>
         {breadcrumbs.map(breadcrumb => (
             <Breadcrumb.Item key={breadcrumb}>{breadcrumb}</Breadcrumb.Item>
         ))}
        </Breadcrumb>
}
