import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import { useAuth } from "./AuthContext.jsx";
import userRoles from "../enums/userRoles.js";
import { notification } from "antd";
import getNotificationConfig from "../helpers/getNotificationConfig.js";
import { useTranslation } from "react-i18next";
import { getStudentInfo } from "../api/student.js";

const StudentContext = createContext();

export function StudentProvider({ children }) {
    const { isAuthenticated, userInfo } = useAuth();
    const { t } = useTranslation();
    const [studentInfo, setStudentInfo] = useState(null);
    const [currentFieldOfStudyInfo, setCurrentFieldOfStudyInfo] =
        useState(null);

    const fetchStudentInfo = useCallback(
        async function () {
            const response = await getStudentInfo();

            if (response.status !== 200)
                return notification.error(
                    getNotificationConfig(t("error-unexpected"))
                );

            setStudentInfo(response.data);
            setCurrentFieldOfStudyInfo({
                ...response.data.fieldsOfStudyInfo[0]
            });
        },
        [t]
    );

    useEffect(() => {
        if (!isAuthenticated) return;
        if (userInfo?.roleId !== userRoles.Student) return;
        fetchStudentInfo();
    }, [fetchStudentInfo, isAuthenticated, userInfo, userInfo?.roleId]);

    return (
        <>
            {userInfo?.roleId !== userRoles.Student ? (
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
