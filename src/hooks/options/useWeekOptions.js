import { useMemo } from "react";
import { getStudyDays } from "../../enums/days.js";
import { oddWeek, oddWeekValues } from "../../helpers/oddWeek.js";
import { useTranslation } from "react-i18next";

export function useWeekOptions(isFullTimeStudies) {
    const { t } = useTranslation();

    const weekDayOptions = useMemo(() => {
        return getStudyDays(isFullTimeStudies).map((weekday, index) => {
            return {
                label: t(getStudyDays(isFullTimeStudies)[index]),
                value: isFullTimeStudies ? index : index + 5
            };
        });
    }, [isFullTimeStudies, t]);

    const oddWeekOptions = useMemo(() => {
        return oddWeekValues.map((value) => {
            return { label: t(oddWeek(value)), value: `${value}` };
        });
    }, [t]);

    return { weekDayOptions, oddWeekOptions };
}
