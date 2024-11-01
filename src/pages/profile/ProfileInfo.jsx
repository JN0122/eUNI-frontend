import { useTranslation } from "react-i18next";
import { useSubPage } from "../../context/SubPageContext.jsx";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Select, Space, Typography } from "antd";
import { LANGS } from "../../enums/languages.js";

const { Text, Title } = Typography;

function ProfileInfo() {
    const { t, i18n } = useTranslation();
    const { setBreadcrumbs } = useSubPage();
    const { userInfo } = useAuth();

    useEffect(() => {
        setBreadcrumbs([{ title: t("basic-info") }]);
        return () => setBreadcrumbs([]);
    }, [setBreadcrumbs, t]);

    return (
        <>
            <Space direction="vertical">
                <Title level={3}>{t("basic-info")}</Title>
                <Space direction="horizontal">
                    <Text type="secondary">{t("given-names")}</Text>
                    <Text>{userInfo.firstname}</Text>
                </Space>
                <Space direction="horizontal">
                    <Text type="secondary">{t("last-name")}</Text>
                    <Text>{userInfo.lastname}</Text>
                </Space>
                <Title level={3}>{t("language")}</Title>
                <Select
                    defaultValue={i18n.language}
                    onChange={(lng) => i18n.changeLanguage(lng)}
                    options={Object.keys(LANGS).map((lng) => {
                        return { value: lng, label: LANGS[lng] };
                    })}
                />
            </Space>
        </>
    );
}

export default ProfileInfo;
