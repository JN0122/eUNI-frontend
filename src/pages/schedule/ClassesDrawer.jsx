import { DatePicker } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../hooks/useDrawer.jsx";
import { useTranslation } from "react-i18next";
import DataDrawer from "../../components/content/DataDrawer.jsx";
import {
    createClass,
    getAcademicDaysOff,
    getAllGroups,
    updateClass
} from "../../api/representative.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getHours } from "../../api/schedule.js";
import { getStudyDays } from "../../enums/days.js";
import { oddWeek, oddWeekValues } from "../../helpers/oddWeek.js";
import { useUser } from "../../hooks/useUser.jsx";
import dayjs from "dayjs";
import { FormInput } from "../../components/form/FormInput.jsx";
import { FormSelect } from "../../components/form/FormSelect.jsx";
import { FormCustomItem } from "../../components/form/FormCustomItem.jsx";

function ClassesDrawer() {
    const { data, type } = useDrawer();
    const { currentFieldOfStudyInfo } = useUser();
    const { t } = useTranslation();
    const [groupOptions, setGroupOptions] = useState([]);
    const [academicYearDaysOff, setAcademicYearDaysOff] = useState(null);
    const [hours, setHours] = useState(null);

    const prepareCreatePayload = useCallback(
        function (form) {
            const isOddWeek = form.getFieldValue("isOddWeek");
            return {
                fieldOfStudyLogId: currentFieldOfStudyInfo?.fieldOfStudyLogId,
                name: form.getFieldValue("className"),
                room: form.getFieldValue("classRoom"),
                isOddWeek: JSON.parse(isOddWeek),
                weekDay: form.getFieldValue("weekDay"),
                groupId: form.getFieldValue("groupId"),
                startHourId: form.getFieldValue("startHourId"),
                endHourId: form.getFieldValue("endHourId")
            };
        },
        [currentFieldOfStudyInfo?.fieldOfStudyLogId]
    );

    const prepareUpdatePayload = useCallback(
        function (form) {
            return {
                fieldOfStudyLogId: currentFieldOfStudyInfo?.fieldOfStudyLogId,
                name: form.getFieldValue("className"),
                room: form.getFieldValue("classRoom"),
                dates: form
                    .getFieldValue("dates")
                    .map((day) => day.format("YYYY-MM-DD")),
                weekDay: form.getFieldValue("weekDay"),
                groupId: form.getFieldValue("groupId"),
                startHourId: form.getFieldValue("startHourId"),
                endHourId: form.getFieldValue("endHourId")
            };
        },
        [currentFieldOfStudyInfo?.fieldOfStudyLogId]
    );

    const weekDayOptions = useMemo(() => {
        return getStudyDays(currentFieldOfStudyInfo?.isFullTime).map(
            (weekday, index) => {
                return {
                    label: t(
                        getStudyDays(currentFieldOfStudyInfo?.isFullTime)[index]
                    ),
                    value: currentFieldOfStudyInfo?.isFullTime
                        ? index
                        : index + 5
                };
            }
        );
    }, [currentFieldOfStudyInfo?.isFullTime, t]);

    const oddWeekOptions = useMemo(() => {
        return oddWeekValues.map((value) => {
            return { label: t(oddWeek(value)), value: `${value}` };
        });
    }, [t]);

    const disabledDate = useCallback(
        (current) => {
            return (
                current &&
                (current < academicYearDaysOff?.yearStartDate ||
                    current > academicYearDaysOff?.yearEndDate ||
                    academicYearDaysOff?.daysOff.find((v) => v.isSame(current)))
            );
        },
        [academicYearDaysOff]
    );

    const getDaysOff = useCallback(
        async function () {
            if (currentFieldOfStudyInfo?.fieldOfStudyLogId === undefined)
                return;
            const response = await getAcademicDaysOff(
                currentFieldOfStudyInfo?.fieldOfStudyLogId
            );
            setAcademicYearDaysOff({
                yearStartDate: dayjs(response.data.startYearDate),
                yearEndDate: dayjs(response.data.endYearDate),
                daysOff: response.data.daysOff.map((date) => dayjs(date))
            });
        },
        [currentFieldOfStudyInfo?.fieldOfStudyLogId]
    );

    const getGroupOptions = useCallback(async () => {
        if (currentFieldOfStudyInfo == null) return null;
        const response = await getAllGroups(
            currentFieldOfStudyInfo.fieldOfStudyLogId
        );
        setGroupOptions(
            response.data.map((group) => {
                return { value: group.groupId, label: group.groupName };
            })
        );
    }, [currentFieldOfStudyInfo]);

    const fetchHours = useCallback(async () => {
        const response = await getHours();
        setHours(response.data);
    }, []);

    useEffect(() => {
        fetchHours();
        getGroupOptions();
        getDaysOff();
    }, [getGroupOptions, fetchHours, getDaysOff]);

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

    const onCreate = useCallback(
        async function (form) {
            await createClass(prepareCreatePayload(form));
        },
        [prepareCreatePayload]
    );

    const onEdit = useCallback(
        async function (form) {
            await updateClass(data?.key, prepareUpdatePayload(form));
        },
        [data?.key, prepareUpdatePayload]
    );

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
                    name="className"
                    label={t("classes")}
                    placeholder={t("enter-class-name")}
                    isRequired={true}
                />
                <FormInput
                    name="classRoom"
                    label={t("room")}
                    placeholder={t("enter-room")}
                    isRequired={true}
                />
                <FormSelect
                    name="groupId"
                    label={t("group-name")}
                    options={groupOptions}
                    isRequired={true}
                />
                {type === DRAWER_TYPE.create ? (
                    <>
                        <FormSelect
                            name="isOddWeek"
                            label={t("class-repeatability")}
                            options={oddWeekOptions}
                            isRequired={true}
                        />
                        <FormSelect
                            name="weekDay"
                            label={t("week-day")}
                            options={weekDayOptions}
                            isRequired={true}
                        />
                    </>
                ) : (
                    <FormCustomItem
                        name="dates"
                        label={t("class-dates")}
                        isRequired={true}
                    >
                        <DatePicker
                            disabledDate={disabledDate}
                            needConfirm
                            multiple
                        />
                    </FormCustomItem>
                )}
                <FormSelect
                    name="startHourId"
                    label={t("start-hour")}
                    options={startHourOptions}
                    isRequired={true}
                />
                <FormSelect
                    name="endHourId"
                    label={t("end-hour")}
                    options={endHourOptions}
                    isRequired={true}
                />
            </DataDrawer>
        </>
    );
}

export default ClassesDrawer;
