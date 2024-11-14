import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import { useAuth } from "./AuthContext.jsx";
import userRoles from "../enums/userRoles.js";
import { getStudentFieldsOfStudy, getStudentGroups } from "../api/student.js";
import { notification } from "antd";
import getNotificationConfig from "../helpers/getNotificationConfig.js";
import { useTranslation } from "react-i18next";

const StudentContext = createContext();

const getStudentGroup = async function (userId, fieldOfStudyLogId) {
    const groups = await getStudentGroups(userId, fieldOfStudyLogId);
    if (groups.status !== 200)
        throw new Error(
            `Cannot get group for userInfo: ${userId} fieldOfStudyLogId: ${fieldOfStudyLogId}`
        );
    return [groups.data];
};

export function StudentProvider({ children }) {
    const { isAuthenticated, userInfo } = useAuth();
    const { t } = useTranslation();
    const [studentInfo, setStudentInfo] = useState(null);
    const [currentFieldOfStudyInfo, setCurrentFieldOfStudyInfo] =
        useState(null);

    const getStudentInfo = useCallback(
        async function () {
            const responseFieldsOfStudy = await getStudentFieldsOfStudy(
                userInfo.id
            );

            if (responseFieldsOfStudy.status !== 200)
                return notification.error(
                    getNotificationConfig(t("error-unexpected"))
                );

            const studentFieldOfStudyPromise = responseFieldsOfStudy.data.map(
                async function (fieldOfStudy) {
                    const groups = await getStudentGroup(
                        userInfo.id,
                        fieldOfStudy.fieldOfStudyLogId
                    );
                    return {
                        ...fieldOfStudy,
                        groups: groups[0]
                    };
                }
            );

            const studentFieldOfStudy = await Promise.all(
                studentFieldOfStudyPromise
            );

            setStudentInfo({
                fieldsOfStudy: [...studentFieldOfStudy]
            });
            setCurrentFieldOfStudyInfo({
                ...studentFieldOfStudy[0]
            });
        },
        [t, userInfo?.id]
    );

    useEffect(() => {
        if (!isAuthenticated) return;
        if (userInfo?.role !== userRoles.Student) return;
        getStudentInfo();
    }, [getStudentInfo, isAuthenticated, userInfo, userInfo?.role]);

    return (
        <>
            {userInfo?.role !== userRoles.Student ? (
                children
            ) : (
                <StudentContext.Provider
                    value={{ studentInfo, currentFieldOfStudyInfo }}
                >
                    {children}
                </StudentContext.Provider>
            )}
        </>
    );
}

export const useStudentContext = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error(
            "useStudentContext must be used within context or user is not a student"
        );
    }
    return context;
};
