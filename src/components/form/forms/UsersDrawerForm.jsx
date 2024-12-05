import { Typography } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../../hooks/useDrawer.jsx";
import useFieldsOfStudyLogsOptions from "../../../hooks/options/useFieldsOfStudyLogsOptions.js";
import { useTranslation } from "react-i18next";
import FormDrawer from "../FormDrawer.jsx";
import { FormItemInput } from "../FormItemInput.jsx";
import { FormItemEmail } from "../FormItemEmail.jsx";
import { FormItemSelect } from "../FormItemSelect.jsx";
import { FormItemNewPasswords } from "../FormItemNewPasswords.jsx";
import useRoleOptions from "../../../hooks/options/useRoleOptions.js";

const { Title } = Typography;

export default function UserDrawerForm({ onCreate, onEdit, ...rest }) {
    const { type } = useDrawer();
    const fieldsOfStudyInfoOptions = useFieldsOfStudyLogsOptions();
    const { t } = useTranslation();
    const roleOptions = useRoleOptions();

    return (
        <>
            <FormDrawer
                width={650}
                title={{ create: t("create-user"), edit: t("edit-user") }}
                onSubmit={{
                    create: onCreate,
                    edit: onEdit
                }}
                {...rest}
            >
                <Title level={3}>{t("basic-info")}</Title>
                <FormItemInput
                    name="firstName"
                    label={t("first-name")}
                    placeholder={t("enter-first-name")}
                    isRequired={true}
                />
                <FormItemInput
                    name="lastName"
                    label={t("last-name")}
                    placeholder={t("enter-last-name")}
                    isRequired={true}
                />
                <FormItemEmail
                    name="email"
                    label={t("email")}
                    placeholder={t("enter-email")}
                    isRequired={true}
                    autoComplete="username"
                />
                <FormItemSelect
                    name="roleId"
                    label={t("role")}
                    options={roleOptions}
                    isRequired={true}
                />
                <FormItemSelect
                    name="representativeFieldsOfStudyLogIds"
                    label={t("representative-fields-of-study")}
                    mode="multiple"
                    popupMatchSelectWidth={false}
                    options={fieldsOfStudyInfoOptions}
                />
                <Title level={3}>{t("password")}</Title>
                <FormItemNewPasswords required={type === DRAWER_TYPE.create} />
            </FormDrawer>
        </>
    );
}
