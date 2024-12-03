import { useCallback, useEffect, useState } from "react";
import { useNotification } from "../useNotification.jsx";
import { getFieldsOfStudyLogs } from "../../api/fieldOfStudy.js";
import { useApi } from "../useApi.jsx";
import { useTranslation } from "react-i18next";

export default function useFieldsOfStudyLogsOptions() {
    const { handleApiError } = useNotification();
    const { t } = useTranslation();
    const [fieldsOfStudyOptions, setFieldsOfStudyOptions] = useState(null);

    const parseGroups = useCallback(
        function (data) {
            setFieldsOfStudyOptions(
                data.map((fieldOfStudy) => {
                    return {
                        label: [
                            fieldOfStudy.yearName,
                            t(`studies-cycle-${fieldOfStudy.studiesCycle}`),
                            fieldOfStudy.isFullTime
                                ? t("full-time-field-of-study")
                                : t("part-time-field-of-study"),
                            fieldOfStudy.name,
                            `${t("semester")} ${fieldOfStudy.semester}`
                        ].join(" > "),
                        value: fieldOfStudy.fieldOfStudyLogId
                    };
                })
            );
        },
        [t]
    );

    const [callApi] = useApi(getFieldsOfStudyLogs, parseGroups, handleApiError);
    useEffect(() => {
        callApi();
    }, [callApi]);

    return fieldsOfStudyOptions;
}
