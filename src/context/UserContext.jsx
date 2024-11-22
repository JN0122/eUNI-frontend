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
    studentRepresentative: [
        "schedule:read",
        "schedule:edit",
        "class:add",
        "class:remove",
        "class:update",
        "class:delete"
    ],
    student: ["schedule:read"],
    admin: ["users:create", "users:read", "users:update", "users:delete"]
};

export function UserProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const [userInfo, setUserInfo] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);

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
                return setStudentInfo({
                    ...response.data,
                    currentFieldOfStudy: 0
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
            if (userInfo.roleId === UserRoles.Admin)
                newPermissions = [
                    ...newPermissions,
                    ...defaultPermissions.admin
                ];
            else {
                newPermissions = [
                    ...newPermissions,
                    ...defaultPermissions.student
                ];
            }
            return newPermissions;
        },
        [userInfo]
    );

    useEffect(() => {
        if (!isAuthenticated) return;
        getUserInfo();
        getStudentInfo();
    }, [getStudentInfo, getUserInfo, isAuthenticated]);

    const hasPermission = function (permission) {
        return !!userPermissions.find((value) => value === permission);
    };

    return (
        <>
            <UserContext.Provider
                value={{ userInfo, studentInfo, hasPermission }}
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
