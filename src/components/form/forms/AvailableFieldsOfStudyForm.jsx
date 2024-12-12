import { FormItemInput } from "../FormItemInput.jsx";
import { FormItemSelect } from "../FormItemSelect.jsx";
import FormDrawer from "../FormDrawer.jsx";
import { useTranslation } from "react-i18next";
import useStudiesCycleOptions from "../../../hooks/options/useStudiesCycleOptions.js";
import useModeOfStudyOptions from "../../../hooks/options/useModeOfStudyOptions.js";

export default function AvailableFieldsOfStudyForm({
    onEdit,
    onCreate,
    ...rest
}) {
    const { t } = useTranslation();
    const studiesCycle = useStudiesCycleOptions();
    const modeOfStudy = useModeOfStudyOptions();

    return (
        <FormDrawer
            title={{
                create: t("create-field-of-study"),
                edit: t("edit-field-of-study")
            }}
            onSubmit={{ create: onCreate, edit: onEdit }}
            {...rest}
        >
            <FormItemInput
                name="name"
                label={t("fields-name")}
                placeholder={t("fields-name")}
                isRequired={true}
            />
            <FormItemInput
                name="abbr"
                label={t("abbr")}
                placeholder={t("abbr")}
                isRequired={true}
            />
            <FormItemSelect
                name="studiesCycle"
                label={t("studies-cycle")}
                isRequired={true}
                options={studiesCycle}
            />
            <FormItemInput
                name="semesterCount"
                label={t("semester-count")}
                placeholder={t("semester-count")}
                type="number"
                isRequired={true}
            />
            <FormItemSelect
                name="fullTime"
                label={t("studies-full-time")}
                isRequired={true}
                options={modeOfStudy}
            />
        </FormDrawer>
    );
}
