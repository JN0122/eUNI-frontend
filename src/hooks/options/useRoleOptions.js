import USER_ROLE from "../../enums/userRoles.js";

export default function useRoleOptions() {
    return [
        { value: USER_ROLE.Admin, label: "Admin" },
        {
            value: USER_ROLE.Student,
            label: "Student"
        }
    ];
}
