import { useTranslation } from "react-i18next";
import { useSubPage } from "../../context/SubPageContext.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { notification, Select, Space, Typography } from "antd";
import { LANGS } from "../../enums/languages.js";
import { changeEmail } from "../../api/user.js";

const { Text, Title } = Typography;

function ProfileInfo() {
    const { t, i18n } = useTranslation();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useSubPage();
    const { userInfo } = useAuth();
    const [email, setEmail] = useState(userInfo.email);

    useEffect(() => {
        addBreadcrumb(t("basic-info"));
        return () => setBreadcrumbsToDefault();
    }, [addBreadcrumb, setBreadcrumbsToDefault, t]);

    async function onEmailChange(newEmail) {
        if (newEmail === email) return;
        const config = {
            message: t("email-success"),
            placement: "bottomRight",
        };

        try {
            await changeEmail({ email: newEmail });
            setEmail(newEmail);
            notification.success(config);
        } catch {
            config.message = t("error-unexpected");
            notification.error(config);
        }
    }

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
                <Space direction="horizontal">
                    <Text type="secondary">{t("email")}</Text>
                    <Text
                        editable={{
                            tooltip: t("edit"),
                            onChange: onEmailChange,
                        }}
                    >
                        {email}
                    </Text>
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
