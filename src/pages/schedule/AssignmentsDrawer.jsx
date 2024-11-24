import { DatePicker, Form, Input, Select } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import DataDrawer from "../../components/DataDrawer.jsx";
import { createAssignment, updateAssignment } from "../../api/assignments.js";
import { useCallback, useEffect, useState } from "react";
import { getClasses } from "../../api/classes.js";
import { useUser } from "../../context/UserContext.jsx";

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
                return { value: classEntity.id, label: classEntity.name };
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
                <Form.Item
                    name="assignmentName"
                    label={t("assignment-name")}
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Input placeholder={t("enter-assignment-name")} />
                </Form.Item>
                <Form.Item
                    name="deadlineDate"
                    label={t("deadline-date")}
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <DatePicker needConfirm />
                </Form.Item>
                <Form.Item
                    label={t("classes")}
                    name="classId"
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Select options={selectValues} />
                </Form.Item>
            </DataDrawer>
        </>
    );
}

export default AssignmentsDrawer;
