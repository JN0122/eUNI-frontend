import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function useSemesterTypesOptions() {
    const { t } = useTranslation();

    return useMemo(() => {
        return [
            {
                label: t("winter-semester"),
                value: "true"
            },
            {
                label: t("summer-semester"),
                value: "false"
            }
        ];
    }, [t]);
}
