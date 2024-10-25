import { Breadcrumb } from "antd";

export function parseBreadcrumbItem(title, path) {
    return {
        title,
        path,
    };
}

function Breadcrumbs({ ...rest }) {
    return <Breadcrumb style={{ marginTop: "1em" }} {...rest} />;
}

export default Breadcrumbs;
