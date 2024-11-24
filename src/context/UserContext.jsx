import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { useAuth } from "./AuthContext.jsx";
import UserRoles from "../enums/userRoles.js";
import { notification } from "antd";
import getNotificationConfig from "../helpers/getNotificationConfig.js";
import { useTranslation } from "react-i18next";
import { getStudentData } from "../api/student.js";
import { getUserData } from "../api/user.js";

const UserContext = createContext();

const defaultPermissions = {
    representative: ["schedule:*", "class:*", "classes:*", "assignments:*"],
    student: ["schedule:read"],
    admin: ["users:*"]
};

export function UserProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const [userInfo, setUserInfo] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);

    const currentStudyOfInfo = useMemo(() => {
        if (studentInfo === null) return null;
        const { currentFieldOfStudyIndex, fieldsOfStudyInfo } = studentInfo;
        return fieldsOfStudyInfo[currentFieldOfStudyIndex];
    }, [studentInfo]);

    const getUserInfo = useCallback(async function () {
        try {
            const response = await getUserData();
            setUserInfo(response.data);
        } catch {
            setUserInfo(null);
        }
    }, []);

    const getStudentInfo = useCallback(
        async function () {
            try {
                const response = await getStudentData();
                const { fieldsOfStudyInfo } = response.data;
                return setStudentInfo({
                    ...response.data,
                    currentFieldOfStudyIndex: fieldsOfStudyInfo.length
                        ? 0
                        : null
                });
            } catch (error) {
                if (error.status === 500)
                    return notification.error(
                        getNotificationConfig(t("error-unexpected"))
                    );
                console.warn("User is no a student!");
                setStudentInfo(null);
            }
        },
        [t]
    );

    const userPermissions = useMemo(
        function () {
            let newPermissions = [];
            if (userInfo === null) return newPermissions;
            if (currentStudyOfInfo?.isRepresentative)
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
        [currentStudyOfInfo?.isRepresentative, userInfo]
    );

    useEffect(() => {
        if (!isAuthenticated) return;
        getUserInfo();
        getStudentInfo();
    }, [getStudentInfo, getUserInfo, isAuthenticated]);

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
            <UserContext.Provider
                value={{
                    userInfo,
                    studentInfo,
                    hasPermission,
                    currentStudyOfInfo
                }}
            >
                {children}
            </UserContext.Provider>
        </>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserContext.Provider");
    }
    return context;
};
