import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function useModeOfStudyOptions() {
    const { t } = useTranslation();

    return useMemo(() => {
        return [
            { value: "true", label: t("full-time-field-of-study") },
            { value: "false", label: t("part-time-field-of-study") }
        ];
    }, [t]);
}
