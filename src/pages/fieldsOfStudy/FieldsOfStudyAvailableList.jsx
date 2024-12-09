import { useTranslation } from "react-i18next";
import ContentBlockBreadcrumb from "../../components/content/ContentBlockBreadcrumb.jsx";
import DrawerNewItemButton from "../../components/form/DrawerNewItemButton.jsx";
import ClassesDrawerForm from "../../components/form/forms/ClassesDrawerForm.jsx";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { useMemo } from "react";
import { DrawerProvider } from "../../hooks/useDrawer.jsx";

export default function FieldsOfStudyAvailableList() {
    const { t } = useTranslation();

    const rows = [
        {
            id: "1",
            key: "1",
            name: "Informatyka stosowana",
            abbr: "K",
            studiesCycle: 1,
            studiesCycleParsed: t("studies-cycle-1"),
            semesterCount: 7,
            fullTimeParsed: t("studies-are-full-time"),
            fullTime: true
        }
    ];

    const columns = useMemo(
        () => [
            {
                title: t("fields-name"),
                dataIndex: "name"
            },
            {
                title: t("abbr"),
                dataIndex: "abbr"
            },
            {
                title: t("studies-cycle"),
                dataIndex: "studiesCycleParsed"
            },
            {
                title: t("semester-count"),
                dataIndex: "semesterCount"
            },
            {
                title: t("studies-full-time"),
                dataIndex: "fullTimeParsed"
            }
        ],
        [t]
    );

    return (
        <ContentBlockBreadcrumb currentPath={t("available-fields")}>
            <DrawerProvider>
                <DrawerNewItemButton label={t("create-field-of-study")} />
                <ClassesDrawerForm initialValues={rows[0]} />
                <TableWithActions columns={columns} rows={rows} />
            </DrawerProvider>
        </ContentBlockBreadcrumb>
    );
}
