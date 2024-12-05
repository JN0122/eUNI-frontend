import { Button, Flex } from "antd";
import { useDrawer } from "../../hooks/useDrawer.jsx";

export default function DrawerNewItemButton({ label, ...rest }) {
    const { openCreateDrawer } = useDrawer();
    return (
        <Flex
            gap="small"
            style={{ paddingBottom: "1rem", flexDirection: "row-reverse" }}
        >
            <Button type={"primary"} onClick={openCreateDrawer} {...rest}>
                {label}
            </Button>
        </Flex>
    );
}
