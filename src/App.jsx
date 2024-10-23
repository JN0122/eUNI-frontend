import { useTranslation } from "react-i18next";
import { Button, Select } from "antd";
import AppLayout from "./components/layout/AppLayout.jsx";
import ContentBlock from "./components/layout/ContentBlock.jsx";
import {parseMenuItem} from "./components/layout/Utils.jsx";
import {DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import SiderMenu from "./components/layout/SiderMenu.jsx";

const langs = { en: "English", pl: "Polski" };

function App() {
    const { t, i18n } = useTranslation();

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
    const ContentBlockSider = <SiderMenu defaultOpenKeys={["sub2"]} fullHeight={true} items={items}/>;

      return (
        <AppLayout siderItems={items} Menu={AppLayoutSider}>
            <ContentBlock siderItems={items} Menu={ContentBlockSider} breadcrumbs={["Home", "App"]}>
              <Select
                defaultValue={i18n.language}
                onChange={(lng) => i18n.changeLanguage(lng)}
                options={Object.keys(langs).map((lng) => {
                  return { value: lng, label: langs[lng] };
                })}
              />
              <Button>{t("test")}</Button>
            </ContentBlock>
        </AppLayout>
      );
}

export default App;
