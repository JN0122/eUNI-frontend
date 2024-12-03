export const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
];

export const FULL_TIME_STUDIES_DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday"
];

export const PART_TIME_STUDIES_DAYS = ["saturday", "sunday"];

export function getStudyDays(isFullTime) {
    return isFullTime ? FULL_TIME_STUDIES_DAYS : PART_TIME_STUDIES_DAYS;
}
