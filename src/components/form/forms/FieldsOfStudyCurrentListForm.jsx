import { FormItemSelect } from "../FormItemSelect.jsx";
import FormDrawer from "../FormDrawer.jsx";
import { useTranslation } from "react-i18next";
import { FormItemInput } from "../FormItemInput.jsx";
import useAvailableFieldsOfStudyOptions from "../../../hooks/options/useAvailableFieldsOfStudyOptions.js";
import useOrganizationOptions from "../../../hooks/options/useOrganizationOptions.js";

export default function FieldsOfStudyCurrentListForm({ onCreate, ...rest }) {
    const { t } = useTranslation();
    const organizationOptions = useOrganizationOptions();
    const availableFieldsOfStudyOptions = useAvailableFieldsOfStudyOptions();

    return (
        <FormDrawer
            title={{
                create: t("create-field-of-study")
            }}
            {...rest}
            onSubmit={{ create: onCreate }}
        >
            <FormItemSelect
                name="organizationId"
                label={t("year-organization")}
                isRequired={true}
                options={organizationOptions}
            />
            <FormItemSelect
                name="fieldOfStudyId"
                label={t("field-of-study")}
                isRequired={true}
                options={availableFieldsOfStudyOptions}
            />
            <FormItemInput
                name="currentSemester"
                label={t("current-semester")}
                isRequired={true}
                type={"number"}
            />
        </FormDrawer>
    );
}
