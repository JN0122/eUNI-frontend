export function parseMenuItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

export function parseBreadcrumbItem(title, path) {
    return {
        title,
        path,
    };
}