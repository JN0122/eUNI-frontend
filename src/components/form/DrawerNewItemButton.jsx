import { Button } from "antd";
import { useDrawer } from "../../hooks/useDrawer.jsx";

export default function DrawerNewItemButton({ label, ...rest }) {
    const { openCreateDrawer } = useDrawer();
    return (
        <Button type={"primary"} onClick={openCreateDrawer} {...rest}>
            {label}
        </Button>
    );
}
