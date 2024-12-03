import { DatePicker } from "antd";
import { useDrawer } from "../../hooks/useDrawer.jsx";
import { useTranslation } from "react-i18next";
import DataDrawer from "../../components/DataDrawer.jsx";
import {
    createAssignment,
    getClasses,
    updateAssignment
} from "../../api/representative.js";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser.jsx";
import { FormInput } from "../../components/form/FormInput.jsx";
import { FormCustomItem } from "../../components/form/FormCustomItem.jsx";
import { FormSelect } from "../../components/form/FormSelect.jsx";

function preparePayload(form) {
    return {
        assignmentName: form.getFieldValue("assignmentName"),
        deadlineDate: form.getFieldValue("deadlineDate").format("YYYY-MM-DD"),
        classId: form.getFieldValue("classId")
    };
}

function AssignmentsDrawer() {
    const { data } = useDrawer();
    const { currentFieldOfStudyInfo } = useUser();
    const { t } = useTranslation();
    const [selectValues, setSelectValues] = useState([]);

    const onCreate = useCallback(async function (form) {
        await createAssignment(preparePayload(form));
    }, []);

    const onEdit = useCallback(
        async function (form) {
            await updateAssignment(data?.key, preparePayload(form));
        },
        [data?.key]
    );

    const getClassesValues = useCallback(async () => {
        if (!currentFieldOfStudyInfo?.fieldOfStudyLogId) return;
        const response = await getClasses(
            currentFieldOfStudyInfo.fieldOfStudyLogId
        );
        setSelectValues(
            response.data.map((classEntity) => {
                return {
                    value: classEntity.id,
                    label: `${classEntity.className} (${classEntity.groupName})`
                };
            })
        );
    }, [currentFieldOfStudyInfo.fieldOfStudyLogId]);

    useEffect(() => {
        getClassesValues();
    }, [getClassesValues]);

    return (
        <>
            <DataDrawer
                title={{
                    create: t("create-assignment"),
                    edit: t("edit-assignment")
                }}
                onCreate={onCreate}
                onEdit={onEdit}
            >
                <FormInput
                    name="assignmentName"
                    label={t("assignment-name")}
                    placeholder={t("enter-assignment-name")}
                    isRequired={true}
                />
                <FormCustomItem
                    name="deadlineDate"
                    label={t("deadline-date")}
                    isRequired={true}
                >
                    <DatePicker needConfirm />
                </FormCustomItem>
                <FormSelect
                    name="classId"
                    label={t("classes")}
                    options={selectValues}
                    isRequired={true}
                />
            </DataDrawer>
        </>
    );
}

export default AssignmentsDrawer;
