import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function useModeOfStudyOptions() {
    const { t } = useTranslation();
    
    return useMemo(() => {
        return [
            { value: "true", label: t("studies-are-full-time") },
            { value: "false", label: t("studies-are-part-time") }
        ];
    }, [t]);
}
