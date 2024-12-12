import { FormItemSelect } from "../FormItemSelect.jsx";
import FormItemDatePicker from "../FormItemDatePicker.jsx";
import FormDrawer from "../FormDrawer.jsx";
import { useTranslation } from "react-i18next";

export default function YearOrganizationForm({
    onCreate,
    onEdit,
    academicYearsOptions,
    semesterTypesOptions,
    ...rest
}) {
    const { t } = useTranslation();
    return (
        <FormDrawer
            title={{ edit: "Edytuj", create: "Utwórz" }}
            onSubmit={{ edit: onEdit, create: onCreate }}
            {...rest}
        >
            <FormItemSelect
                label={t("academic-year")}
                name="yearId"
                options={academicYearsOptions}
                disabled={true}
                isRequired={true}
            />
            <FormItemSelect
                label={t("semester-type")}
                name="firstHalfOfYear"
                options={semesterTypesOptions}
                disabled={true}
                isRequired={true}
            />
            <FormItemDatePicker
                label={t("start-date")}
                name="startDateParsed"
                isRequired={true}
            />
            <FormItemDatePicker
                label={t("end-date")}
                name="endDateParsed"
                isRequired={true}
            />
            <FormItemDatePicker
                label={t("days-off")}
                name="daysOffParsed"
                multiple
            />
        </FormDrawer>
    );
}
