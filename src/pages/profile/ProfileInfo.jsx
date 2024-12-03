import { useTranslation } from "react-i18next";
import { useContentBlock } from "../../hooks/useContentBlock.jsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { App, Button, Select, Space, Typography } from "antd";
import LANGS from "../../enums/languages.js";
import { changeEmail } from "../../api/user.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";
import { useUser } from "../../hooks/useUser.jsx";
import { getFieldsOfStudyLogs, getGroups } from "../../api/fieldOfStudy.js";
import CLASSES_TYPE from "../../enums/classesType.js";
import {
    changeCurrentFieldOfStudy,
    changeStudentGroup
} from "../../api/student.js";
import SelectSearchByLabel from "../../components/form/SelectSearchByLabel.jsx";
import { CalendarOutlined } from "@ant-design/icons";
import { getGroupCalendarPath } from "../../api/schedule.js";

const { Text, Title } = Typography;

function ProfileInfo() {
    const { t, i18n } = useTranslation();
    const { notification } = App.useApp();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const { userInfo, currentFieldOfStudyInfo, reFetchStudentInfo } = useUser();
    const [email, setEmail] = useState(userInfo.email);
    const [groupsOptions, setGroupsOptions] = useState(null);
    const [fieldsOfStudyOptions, setFieldsOfStudyOptions] = useState(null);
    const { message } = App.useApp();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

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

    const fetchFieldsOfStudyLogs = useCallback(
        async function () {
            try {
                const response = await getFieldsOfStudyLogs();
                setFieldsOfStudyOptions(
                    response.data.map((fieldOfStudy) => {
                        return {
                            label: [
                                fieldOfStudy.yearName,
                                t(`studies-cycle-${fieldOfStudy.studiesCycle}`),
                                fieldOfStudy.isFullTime
                                    ? t("full-time-field-of-study")
                                    : t("part-time-field-of-study"),
                                fieldOfStudy.name,
                                `${t("semester")} ${fieldOfStudy.semester}`
                            ].join(" > "),
                            value: fieldOfStudy.fieldOfStudyLogId
                        };
                    })
                );
            } catch (err) {
                notification.error(
                    getNotificationConfig(t("error-unexpected"))
                );
                console.error(err.message);
            }
        },
        [notification, t]
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

    const handleCurrentFieldOfStudyChange = async function (id) {
        try {
            await changeCurrentFieldOfStudy(id);
            reFetchStudentInfo();
            notification.success(
                getNotificationConfig(
                    t("success-current-field-of-study-change")
                )
            );
        } catch (error) {
            notification.error(getNotificationConfig(t("error-unexpected")));
            console.log(error?.message);
        }
    };

    const studentContent = useMemo(() => {
        if (currentFieldOfStudyInfo == null) return null;
        if (fieldsOfStudyOptions === null) {
            fetchFieldsOfStudyLogs();
            return null;
        }
        return (
            <>
                <Title level={3}>{t("study-info")}</Title>
                <Text type="secondary">
                    {`${t("current-field-of-study")}: `}
                </Text>
                <SelectSearchByLabel
                    name="representativeFieldsOfStudyLogIds"
                    popupMatchSelectWidth={false}
                    defaultValue={currentFieldOfStudyInfo?.fieldOfStudyLogId}
                    style={{ minWidth: 100 }}
                    onChange={handleCurrentFieldOfStudyChange}
                    options={fieldsOfStudyOptions}
                />
            </>
        );
    }, [
        currentFieldOfStudyInfo,
        fetchFieldsOfStudyLogs,
        fieldsOfStudyOptions,
        handleCurrentFieldOfStudyChange,
        t
    ]);

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
        [
            currentFieldOfStudyInfo?.fieldOfStudyLogId,
            notification,
            reFetchStudentInfo,
            t
        ]
    );

    const handleCopy = async function (groupId) {
        const response = await getGroupCalendarPath(
            currentFieldOfStudyInfo?.fieldOfStudyLogId,
            groupId
        );

        navigator.clipboard
            .writeText(apiUrl + response.data)
            .then(() => {
                message.open({
                    type: "success",
                    content: t("success-copy")
                });
            })
            .catch(() => {
                message.open({
                    type: "error",
                    content: t("error-cannot-copy")
                });
            });
    };

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
                            <Button
                                color="primary"
                                variant="outlined"
                                onClick={() => handleCopy(value)}
                            >
                                {t("copy-link")}
                                <CalendarOutlined />
                            </Button>
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
