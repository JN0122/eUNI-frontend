import { useTranslation } from "react-i18next";
import { useContentBlock } from "../../context/ContentBlockContext.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { notification, Select, Space, Typography } from "antd";
import LANGS from "../../enums/languages.js";
import { changeEmail } from "../../api/user.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";

const { Text, Title } = Typography;

function ProfileInfo() {
    const { t, i18n } = useTranslation();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const { userInfo } = useAuth();
    const [email, setEmail] = useState(userInfo.email);

    useEffect(() => {
        addBreadcrumb(t("basic-info"));
        return () => setBreadcrumbsToDefault();
    }, [addBreadcrumb, setBreadcrumbsToDefault, t]);

    async function onEmailChange(newEmail) {
        if (newEmail === email) return;
        try {
            await changeEmail({ email: newEmail });
            setEmail(newEmail);
            notification.success(getNotificationConfig(t("email-success")));
        } catch {
            notification.error(getNotificationConfig(t("error-unexpected")));
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
