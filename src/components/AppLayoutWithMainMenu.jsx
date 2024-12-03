import AppLayout from "./AppLayout.jsx";
import SiderMenu from "./SiderMenu.jsx";
import { Outlet } from "react-router-dom";
import { useMainMenu } from "../hooks/useMainMenu.jsx";

export default function AppLayoutWithMainMenu() {
    const { activePageKey, items } = useMainMenu();
    return (
        <AppLayout
            menu={
                <SiderMenu
                    theme="dark"
                    items={items}
                    activeKey={activePageKey}
                />
            }
        >
            <Outlet />
        </AppLayout>
    );
}
