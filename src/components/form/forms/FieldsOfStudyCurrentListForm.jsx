import { FormItemSelect } from "../FormItemSelect.jsx";
import FormDrawer from "../FormDrawer.jsx";
import { useTranslation } from "react-i18next";
import { FormItemInput } from "../FormItemInput.jsx";
import useSemesterTypesOptions from "../../../hooks/options/useSemesterTypesOptions.js";
import useAcademicYears from "../../../hooks/options/useAcademicYears.js";
import useAvailableFieldsOfStudyOptions from "../../../hooks/options/useAvailableFieldsOfStudyOptions.js";

export default function FieldsOfStudyCurrentListForm({ onCreate, ...rest }) {
    const { t } = useTranslation();
    const semesterTypesOptions = useSemesterTypesOptions();
    const academicYearOptions = useAcademicYears();
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
                name="academicYearId"
                label={t("academic-year")}
                isRequired={true}
                options={academicYearOptions}
            />
            <FormItemSelect
                name="firstHalfOfYear"
                label={t("semester-type")}
                isRequired={true}
                options={semesterTypesOptions}
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
