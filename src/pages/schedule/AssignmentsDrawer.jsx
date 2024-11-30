import { DatePicker } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import DataDrawer from "../../components/DataDrawer.jsx";
import {
    createAssignment,
    getClasses,
    updateAssignment
} from "../../api/representative.js";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../context/UserContext.jsx";
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
    const { data, type } = useDrawer();
    const { currentFieldOfInfo } = useUser();
    const { t } = useTranslation();
    const [selectValues, setSelectValues] = useState([]);

    const handleOnSave = async function (form) {
        if (type === DRAWER_TYPE.edit)
            await updateAssignment(data.key, preparePayload(form));
        else if (type === DRAWER_TYPE.create) {
            await createAssignment(preparePayload(form));
        } else {
            console.error("unknown drawer type");
        }
    };

    const getClassesValues = useCallback(async () => {
        if (!currentFieldOfInfo?.fieldOfStudyLogId) return;
        const response = await getClasses(currentFieldOfInfo.fieldOfStudyLogId);
        setSelectValues(
            response.data.map((classEntity) => {
                return {
                    value: classEntity.id,
                    label: `${classEntity.className} (${classEntity.groupName})`
                };
            })
        );
    }, [currentFieldOfInfo.fieldOfStudyLogId]);

    useEffect(() => {
        getClassesValues();
    }, [getClassesValues]);

    return (
        <>
            <DataDrawer
                title={
                    type === DRAWER_TYPE.edit
                        ? t("edit-assignment")
                        : t("create-assignment")
                }
                onSave={handleOnSave}
            >
                <FormInput
                    name="assignmentName"
                    label={t("assignment-name")}
                    placeholder={t("enter-assignment-name")}
                />
                <FormCustomItem name="deadlineDate" label={t("deadline-date")}>
                    <DatePicker needConfirm />
                </FormCustomItem>
                <FormSelect
                    name="classId"
                    label={t("classes")}
                    options={selectValues}
                />
            </DataDrawer>
        </>
    );
}

export default AssignmentsDrawer;
