import { useTranslation } from "react-i18next";
import { useContentBlock } from "../../context/ContentBlockContext.jsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { notification, Select, Space, Typography } from "antd";
import LANGS from "../../enums/languages.js";
import { changeEmail } from "../../api/user.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";
import { useUser } from "../../context/UserContext.jsx";
import { getGroups } from "../../api/fieldOfStudy.js";
import CLASSES_TYPE from "../../enums/classesType.js";

const { Text, Title } = Typography;

function ProfileInfo() {
    const { t, i18n } = useTranslation();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const { userInfo, currentFieldOfInfo } = useUser();
    const [email, setEmail] = useState(userInfo.email);
    const [groupsOptions, setGroupsOptions] = useState(null);

    const getGroupData = useCallback(
        async function () {
            const response = await getGroups(
                currentFieldOfInfo.fieldOfStudyLogId
            );
            if (response.status !== 200) {
                console.error("Cannot get group data");
                return;
            }
            setGroupsOptions(() => {
                const groups = {};
                response.data.map((data) => {
                    const newGroup = {
                        label: data.groupName,
                        value: data.groupId
                    };
                    groups[data.type] =
                        groups[data.type] === undefined
                            ? [newGroup]
                            : [...groups[data.type], newGroup];
                });
                return groups;
            });
        },
        [currentFieldOfInfo?.fieldOfStudyLogId]
    );

    useEffect(() => {
        addBreadcrumb(t("basic-info"));
        if (currentFieldOfInfo !== null) getGroupData();
        return () => setBreadcrumbsToDefault();
    }, [
        addBreadcrumb,
        getGroupData,
        setBreadcrumbsToDefault,
        t,
        currentFieldOfInfo
    ]);

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

    const studentContent = useMemo(() => {
        if (currentFieldOfInfo == null) return null;
        return (
            <>
                <Title level={3}>{t("study-info")}</Title>
                <Space direction="horizontal">
                    <Text type="secondary">
                        {`${t("current-field-of-study")}: `}
                    </Text>
                    <Text>{currentFieldOfInfo.name}</Text>
                </Space>
            </>
        );
    }, [currentFieldOfInfo, t]);

    const groupContent = useMemo(() => {
        if (groupsOptions === null) return null;
        return (
            <>
                <Space direction="horizontal">
                    <Text type="secondary">{`${t("semester")}: `}</Text>
                    <Text>{currentFieldOfInfo.semester}</Text>
                </Space>
                {groupsOptions[CLASSES_TYPE.lecture] && (
                    <Space direction="horizontal">
                        <Text type="secondary">{t("lecture")}</Text>
                        <Select options={groupsOptions[CLASSES_TYPE.lecture]} />
                    </Space>
                )}
                {groupsOptions[CLASSES_TYPE.deanGroup] && (
                    <Space direction="horizontal">
                        <Text type="secondary">{t("dean-group")}</Text>
                        <Select
                            options={groupsOptions[CLASSES_TYPE.deanGroup]}
                        />
                    </Space>
                )}
                {groupsOptions[CLASSES_TYPE.project] && (
                    <Space direction="horizontal">
                        <Text type="secondary">{t("project")}</Text>
                        <Select options={groupsOptions[CLASSES_TYPE.project]} />
                    </Space>
                )}
                {groupsOptions[CLASSES_TYPE.computer] && (
                    <Space direction="horizontal">
                        <Text type="secondary">{t("computer")}</Text>
                        <Select
                            options={groupsOptions[CLASSES_TYPE.computer]}
                        />
                    </Space>
                )}
                {groupsOptions[CLASSES_TYPE.laboratory] && (
                    <Space direction="horizontal">
                        <Text type="secondary">{t("laboratory")}</Text>
                        <Select
                            options={groupsOptions[CLASSES_TYPE.laboratory]}
                        />
                    </Space>
                )}
            </>
        );
    }, [currentFieldOfInfo?.semester, groupsOptions, t]);

    return (
        <>
            <Space direction="vertical">
                <Title level={3}>{t("basic-info")}</Title>
                <Space direction="horizontal">
                    <Text type="secondary">{t("given-names")}</Text>
                    <Text>{userInfo.firstName}</Text>
                </Space>
                <Space direction="horizontal">
                    <Text type="secondary">{t("last-name")}</Text>
                    <Text>{userInfo.lastName}</Text>
                </Space>
                <Space direction="horizontal">
                    <Text type="secondary">{t("email")}</Text>
                    <Text
                        editable={{
                            tooltip: t("edit"),
                            onChange: onEmailChange
                        }}
                    >
                        {email}
                    </Text>
                </Space>
                {studentContent}
                {groupContent}
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
