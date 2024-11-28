import { Form, Input, Select } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import DataDrawer from "../../components/DataDrawer.jsx";
import {
    createClass,
    getAllGroups,
    updateClass
} from "../../api/representative.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getHours } from "../../api/schedule.js";
import { getStudyDays } from "../../enums/weekDays.js";
import { isOddWeekMap, oddWeekValues } from "../../helpers/isOddWeekMap.js";
import { useUser } from "../../context/UserContext.jsx";

function ClassesDrawer() {
    const { data, type } = useDrawer();
    const { currentFieldOfInfo } = useUser();
    const { t } = useTranslation();
    const [groupOptions, setGroupOptions] = useState([]);
    const [hours, setHours] = useState(null);

    const preparePayload = useCallback(
        function (form) {
            const isOddWeek = form.getFieldValue("isOddWeek");
            return {
                fieldOfStudyLogId: currentFieldOfInfo?.fieldOfStudyLogId,
                name: form.getFieldValue("className"),
                room: form.getFieldValue("classRoom"),
                isOddWeek: JSON.parse(isOddWeek),
                weekDay: form.getFieldValue("weekDay"),
                groupId: form.getFieldValue("groupId"),
                startHourId: form.getFieldValue("startHourId"),
                endHourId: form.getFieldValue("endHourId")
            };
        },
        [currentFieldOfInfo?.fieldOfStudyLogId]
    );

    const weekDayOptions = useMemo(() => {
        return getStudyDays(currentFieldOfInfo?.isFullTime).map(
            (weekday, index) => {
                return {
                    label: t(
                        getStudyDays(currentFieldOfInfo?.isFullTime)[index]
                    ),
                    value: currentFieldOfInfo?.isFullTime ? index : index + 5
                };
            }
        );
    }, [currentFieldOfInfo?.isFullTime, t]);

    const oddWeekOptions = useMemo(() => {
        return oddWeekValues.map((value) => {
            return { label: t(isOddWeekMap(value)), value: `${value}` };
        });
    }, [t]);

    const handleOnSave = useCallback(
        async function (form) {
            if (type === DRAWER_TYPE.edit)
                await updateClass(data.key, preparePayload(form));
            else if (type === DRAWER_TYPE.create) {
                await createClass(preparePayload(form));
            } else {
                console.error("unknown drawer type");
            }
        },
        [data?.key, preparePayload, type]
    );

    const getGroupOptions = useCallback(async () => {
        if (currentFieldOfInfo == null) return null;
        const response = await getAllGroups(
            currentFieldOfInfo.fieldOfStudyLogId
        );
        setGroupOptions(
            response.data.map((group) => {
                return { value: group.groupId, label: group.groupName };
            })
        );
    }, [currentFieldOfInfo]);

    const fetchHours = useCallback(async () => {
        const response = await getHours();
        setHours(response.data);
    }, []);

    useEffect(() => {
        fetchHours();
        getGroupOptions();
    }, [getGroupOptions, fetchHours]);

    const getHourOptions = useCallback(
        (value) => {
            if (hours === null) return null;
            return hours.map((hour) => {
                return { label: hour[value], value: hour.hourId };
            });
        },
        [hours]
    );

    const startHourOptions = useMemo(() => {
        return getHourOptions("startTime");
    }, [getHourOptions]);

    const endHourOptions = useMemo(() => {
        return getHourOptions("endTime");
    }, [getHourOptions]);

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
                    label={t("classes")}
                    name="className"
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Input placeholder={t("enter-class-name")} />
                </Form.Item>
                <Form.Item
                    name="classRoom"
                    label={t("room")}
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Input placeholder={t("enter-room")} />
                </Form.Item>
                <Form.Item
                    label={t("group-name")}
                    name="groupId"
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Select options={groupOptions} />
                </Form.Item>
                <Form.Item
                    label={t("class-repeatability")}
                    name="isOddWeek"
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Select options={oddWeekOptions} />
                </Form.Item>
                <Form.Item
                    label={t("week-day")}
                    name="weekDay"
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Select options={weekDayOptions} />
                </Form.Item>
                <Form.Item
                    label={t("start-hour")}
                    name="startHourId"
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Select options={startHourOptions} />
                </Form.Item>
                <Form.Item
                    label={t("end-hour")}
                    name="endHourId"
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Select options={endHourOptions} />
                </Form.Item>
            </DataDrawer>
        </>
    );
}

export default ClassesDrawer;
