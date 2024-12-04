import { useTranslation } from "react-i18next";
import { useContentBlock } from "../../hooks/useContentBlock.jsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Select, Space, Typography } from "antd";
import LANGS from "../../enums/languages.js";
import { changeEmail } from "../../api/user.js";
import { useUser } from "../../hooks/useUser.jsx";
import CLASSES_TYPE from "../../enums/classesType.js";
import {
    changeCurrentFieldOfStudy,
    changeStudentGroup
} from "../../api/student.js";
import SelectSearchByLabel from "../../components/form/SelectSearchByLabel.jsx";
import { CalendarOutlined } from "@ant-design/icons";
import { getGroupCalendarPath } from "../../api/schedule.js";
import useFieldOfStudyGroupsOptions from "../../hooks/options/useFieldOfStudyGroupsOptions.jsx";
import useFieldsOfStudyLogsOptions from "../../hooks/options/useFieldsOfStudyLogsOptions.jsx";
import { CopyToClipboard } from "../../helpers/CopyToClipboard.js";
import { useNotification } from "../../hooks/useNotification.jsx";
import { useApi } from "../../hooks/useApi.jsx";
import { NOTIFICATION_TYPES } from "../../enums/NotificationTypes.js";

const { Text, Title } = Typography;
const apiUrl = import.meta.env.VITE_API_BASE_URL;

function ProfileInfo() {
    const { t, i18n } = useTranslation();
    const { displayMessage, displayNotification, handleApiError } =
        useNotification();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const { userInfo, currentFieldOfStudyInfo, reFetchStudentInfo } = useUser();

    const groupsOptions = useFieldOfStudyGroupsOptions(
        currentFieldOfStudyInfo?.fieldOfStudyLogId
    );
    const fieldsOfStudyOptions = useFieldsOfStudyLogsOptions();
    const [email, setEmail] = useState(userInfo?.email);

    useEffect(() => {
        addBreadcrumb(t("basic-info"));
        return () => setBreadcrumbsToDefault();
    }, [addBreadcrumb, setBreadcrumbsToDefault, t, currentFieldOfStudyInfo]);

    const changeEmailRequest = useApi(
        changeEmail,
        () => {
            displayNotification(t("email-success"));
        },
        handleApiError
    );

    const onEmailChange = useCallback(
        async function (newEmail) {
            if (newEmail === email) return;
            await changeEmailRequest({ email: newEmail }).then(() =>
                setEmail(newEmail)
            );
        },
        [changeEmailRequest, email]
    );

    const changeCurrentFieldOfStudyRequest = useApi(
        changeCurrentFieldOfStudy,
        () => {
            displayNotification(t("success-current-field-of-study-change"));
            reFetchStudentInfo();
        },
        handleApiError
    );

    const handleCurrentFieldOfStudyChange = useCallback(
        async function (id) {
            await changeCurrentFieldOfStudyRequest(id);
        },
        [changeCurrentFieldOfStudyRequest]
    );

    const studentContent = useMemo(() => {
        if (currentFieldOfStudyInfo == null) return null;
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

    const groupChangeRequest = useApi(
        changeStudentGroup,
        () => {
            displayNotification(t("success-group-changed"));
            reFetchStudentInfo();
        },
        handleApiError
    );

    const handleGroupChange = useCallback(
        async function (groupId, typeId) {
            await groupChangeRequest({
                fieldOfStudyLogId: currentFieldOfStudyInfo?.fieldOfStudyLogId,
                groupId,
                groupType: typeId
            });
        },
        [currentFieldOfStudyInfo?.fieldOfStudyLogId, groupChangeRequest]
    );

    const getGroupCalendarPathRequest = useApi(
        getGroupCalendarPath,
        (data) =>
            CopyToClipboard(
                apiUrl + data,
                () =>
                    displayMessage(
                        t("success-copy"),
                        NOTIFICATION_TYPES.success
                    ),
                () =>
                    displayMessage(
                        t("error-cannot-copy"),
                        NOTIFICATION_TYPES.error
                    )
            ),
        handleApiError
    );

    const handleCopy = async function (groupId) {
        await getGroupCalendarPathRequest(
            currentFieldOfStudyInfo?.fieldOfStudyLogId,
            groupId
        );
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
        getCurrentStudentGroup,
        groupsOptions,
        handleCopy,
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
