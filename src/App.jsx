import { useTranslation } from "react-i18next";
import { Button, Select } from "antd";
import AppLayout from "./components/layout/AppLayout.jsx";
import ContentBlock from "./components/layout/ContentBlock.jsx";
import {parseMenuItems} from "./components/layout/Utils.jsx";
import {DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import SiderMenu from "./components/layout/SiderMenu.jsx";

const langs = { en: "English", pl: "Polski" };

function App() {
    const { t, i18n } = useTranslation();

    const items = [
        parseMenuItems("Option 1", "1", <PieChartOutlined />),
        parseMenuItems("Option 2", "2", <DesktopOutlined />),
        parseMenuItems("User", "sub1", <UserOutlined />, [
            parseMenuItems("Tom", "3"),
            parseMenuItems("Bill", "4"),
            parseMenuItems("Alex", "5"),
        ]),
        parseMenuItems("Team", "sub2", <TeamOutlined />, [
            parseMenuItems("Team 1", "6"),
            parseMenuItems("Team 2", "8"),
        ]),
        parseMenuItems("Files", "9", <FileOutlined />),
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
