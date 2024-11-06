export default function getSubpagePath(path) {
    const subpagePath = path.replace(/\/$/, "");

    return subpagePath.substring(subpagePath.lastIndexOf("/") + 1);
}
