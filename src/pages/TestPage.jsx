import { useTranslation } from "react-i18next";
import { Button, Select } from "antd";
import AppLayout from "../components/layout/AppLayout.jsx";
import ContentBlock from "../components/layout/ContentBlock.jsx";
import { PieChartOutlined } from "@ant-design/icons";
import SiderMenu from "../components/layout/SiderMenu.jsx";

const langs = { en: "English", pl: "Polski" };

function TestPage() {
    const { t, i18n } = useTranslation();

    const items = [
        {
            label: "Option 1",
            key: "1",
            icon: <PieChartOutlined />,
        },
        {
            label: "Option 2",
            key: "2",
            icon: <PieChartOutlined />,
            children: [
                {
                    label: "Tom",
                    key: "3",
                },
                {
                    label: "Bill",
                    key: "4",
                },
            ],
        },
    ];
    const breadcrumbs = [{ title: "Home" }, { title: "App" }];

    const AppLayoutSider = <SiderMenu theme="dark" items={items} />;
    const ContentBlockSider = (
        <SiderMenu defaultOpenKeys={["sub2"]} fullHeight={true} items={items} />
    );

    return (
        <AppLayout Menu={AppLayoutSider}>
            <ContentBlock menu={ContentBlockSider} breadcrumbs={breadcrumbs}>
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

export default TestPage;
