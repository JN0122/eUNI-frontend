import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { useAuth } from "./useAuth.jsx";
import UserRoles from "../enums/userRoles.js";
import { getStudentData } from "../api/student.js";
import { getUserData } from "../api/user.js";
import { useApi } from "./useApi.js";
import { useNotification } from "./useNotification.jsx";

const UseUser = createContext();

const defaultPermissions = {
    representative: ["schedule:*", "class:*", "classes:*", "assignments:*"],
    student: ["schedule:read"],
    admin: ["users:*"]
};

export function UserProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const { handleApiError } = useNotification();

    const studentInfoRequest = useApi(
        getStudentData,
        (data) => {
            setStudentInfo(data);
        },
        (e) => {
            setStudentInfo(null);
            handleApiError(e);
        }
    );

    const userInfoRequest = useApi(
        getUserData,
        (data) => {
            setUserInfo(data);
            if (data.roleId === UserRoles.Student) studentInfoRequest();
        },
        (e) => {
            setUserInfo(null);
            handleApiError(e);
        }
    );

    const reFetchStudentInfo = useCallback(async () => {
        await studentInfoRequest();
    }, [studentInfoRequest]);

    const userPermissions = useMemo(
        function () {
            let newPermissions = [];
            if (userInfo === null) return newPermissions;
            if (studentInfo?.currentFieldOfStudyInfo?.isRepresentative)
                newPermissions = [
                    ...newPermissions,
                    ...defaultPermissions.representative
                ];

            if (userInfo.roleId === UserRoles.Admin)
                newPermissions = [
                    ...newPermissions,
                    ...defaultPermissions.admin
                ];
            else if (userInfo.roleId === UserRoles.Student)
                newPermissions = [
                    ...newPermissions,
                    ...defaultPermissions.student
                ];

            return newPermissions;
        },
        [studentInfo?.currentFieldOfStudyInfo, userInfo]
    );

    useEffect(() => {
        if (!isAuthenticated) {
            setUserInfo(null);
            setStudentInfo(null);
            return;
        }
        userInfoRequest();
    }, [isAuthenticated]);

    const hasPermission = useCallback(
        function (neededPermission) {
            return !!userPermissions.find((userPermission) => {
                const [userCat, userPerm] = userPermission.split(":");
                const [cat, perm] = neededPermission.split(":");
                if (userCat === cat && (userPerm === perm || userPerm === "*"))
                    return true;
            });
        },
        [userPermissions]
    );

    return (
        <>
            <UseUser.Provider
                value={{
                    userInfo,
                    studentInfo,
                    hasPermission,
                    currentFieldOfStudyInfo:
                        studentInfo?.currentFieldOfStudyInfo,
                    reFetchStudentInfo
                }}
            >
                {children}
            </UseUser.Provider>
        </>
    );
}

export const useUser = () => {
    const context = useContext(UseUser);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};
