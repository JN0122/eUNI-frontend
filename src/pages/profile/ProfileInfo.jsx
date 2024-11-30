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
import { changeStudentGroup } from "../../api/student.js";

const { Text, Title } = Typography;

function ProfileInfo() {
    const { t, i18n } = useTranslation();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const { userInfo, currentFieldOfStudyInfo, reFetchStudentInfo } = useUser();
    const [email, setEmail] = useState(userInfo.email);
    const [groupsOptions, setGroupsOptions] = useState(null);

    const getGroupData = useCallback(
        async function () {
            const response = await getGroups(
                currentFieldOfStudyInfo?.fieldOfStudyLogId
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
        [currentFieldOfStudyInfo?.fieldOfStudyLogId]
    );

    useEffect(() => {
        addBreadcrumb(t("basic-info"));
        if (currentFieldOfStudyInfo !== null) getGroupData();
        return () => setBreadcrumbsToDefault();
    }, [
        addBreadcrumb,
        getGroupData,
        setBreadcrumbsToDefault,
        t,
        currentFieldOfStudyInfo
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
        if (currentFieldOfStudyInfo == null) return null;
        return (
            <>
                <Title level={3}>{t("study-info")}</Title>
                <Space direction="horizontal">
                    <Text type="secondary">
                        {`${t("current-field-of-study")}: `}
                    </Text>
                    <Text>{currentFieldOfStudyInfo.name}</Text>
                </Space>
            </>
        );
    }, [currentFieldOfStudyInfo, t]);

    const getCurrentStudentGroup = useCallback(
        function (typeId) {
            if (currentFieldOfStudyInfo?.groups === undefined) return null;
            const currentGroup = currentFieldOfStudyInfo.groups.find(
                (group) => group.type === typeId
            );
            return currentGroup?.groupId;
        },
        [currentFieldOfStudyInfo?.groups]
    );

    const handleGroupChange = useCallback(
        async function (groupId, typeId) {
            try {
                await changeStudentGroup({
                    fieldOfStudyLogId:
                        currentFieldOfStudyInfo?.fieldOfStudyLogId,
                    groupId,
                    groupType: typeId
                });
                reFetchStudentInfo();
            } catch (error) {
                console.error(error);
                notification.error(
                    getNotificationConfig(t("error-unexpected"))
                );
            }
        },
        [currentFieldOfStudyInfo?.fieldOfStudyLogId, reFetchStudentInfo, t]
    );

    const groupContent = useMemo(() => {
        if (groupsOptions === null) return null;
        return (
            <>
                {Object.keys(CLASSES_TYPE).map((classTypeName, typeId) => {
                    if (groupsOptions[typeId] === undefined) return;
                    const value = getCurrentStudentGroup(typeId);
                    return (
                        <Space key={typeId} direction="horizontal">
                            <Text type="secondary">{t(classTypeName)}</Text>
                            <Select
                                style={{ width: 100 }}
                                options={groupsOptions[typeId]}
                                defaultValue={value}
                                onChange={(groupId) =>
                                    handleGroupChange(groupId, typeId)
                                }
                            />
                        </Space>
                    );
                })}
            </>
        );
    }, [
        currentFieldOfStudyInfo?.semester,
        getCurrentStudentGroup,
        groupsOptions,
        handleGroupChange,
        t
    ]);

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
