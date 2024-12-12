import { useCallback, useEffect, useState } from "react";
import { useNotification } from "../useNotification.jsx";
import { getFieldsOfStudyLogs } from "../../api/fieldOfStudy.js";
import { useApi } from "../useApi.js";
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
                        yearId: fieldOfStudy.yearId,
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

    const getFieldsOfStudyLogsRequest = useApi(
        getFieldsOfStudyLogs,
        parseGroups,
        handleApiError
    );
    useEffect(() => {
        getFieldsOfStudyLogsRequest();
    }, []);

    return fieldsOfStudyOptions;
}
