import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout.jsx";
import {DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import SiderMenu, {parseMenuItem} from "../components/layout/SiderMenu.jsx";
import {Outlet} from "react-router-dom";

function Dashboard() {
    const { t } = useTranslation();

    const items = [
            parseMenuItem("Option 1", "1", <PieChartOutlined />),
            parseMenuItem("Option 2", "2", <DesktopOutlined />),
            parseMenuItem("User", "sub1", <UserOutlined />, [
                parseMenuItem("Tom", "3"),
                parseMenuItem("Bill", "4"),
                parseMenuItem("Alex", "5"),
            ]),
            parseMenuItem("Team", "sub2", <TeamOutlined />, [
                parseMenuItem("Team 1", "6"),
                parseMenuItem("Team 2", "8"),
            ]),
            parseMenuItem("Files", "9", <FileOutlined />),
    ];

    const AppLayoutSider = <SiderMenu theme="dark" items={items} />;

    return (
        <AppLayout Menu={AppLayoutSider}>
            <Outlet/>
        </AppLayout>
    );
}

export default Dashboard;
