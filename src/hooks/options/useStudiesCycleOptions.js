import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function useStudiesCycleOptions() {
    const { t } = useTranslation();
    
    return useMemo(() => {
        return [
            { value: 1, label: t("studies-cycle-1") },
            { value: 2, label: t("studies-cycle-2") }
        ];
    }, [t]);
}
