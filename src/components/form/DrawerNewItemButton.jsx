import { Button, Flex } from "antd";

export default function DrawerNewItemButton({ label, onClick, ...rest }) {
    return (
        <Flex
            gap="small"
            style={{ paddingBottom: "1rem", flexDirection: "row-reverse" }}
        >
            <Button type={"primary"} onClick={onClick} {...rest}>
                {label}
            </Button>
        </Flex>
    );
}
