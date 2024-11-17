import { App, Button, Drawer, Form, Space } from "antd";
import { useDrawer } from "../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
import getNotificationConfig from "../helpers/getNotificationConfig.js";

function isFormValid(form) {
    const errors = form.getFieldsError().map((field) => !!field.errors.length);
    for (const error of errors) {
        if (error) return false;
    }
    return true;
}

function getFieldsObject(data) {
    return Object.keys(data).map((key) => {
        return {
            name: key,
            value: data[key]
        };
    });
}

function DataDrawer({ title, onSave, children }) {
    const { isOpen, closeDrawer, data, setData } = useDrawer();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { notification } = App.useApp();

    useEffect(() => {
        if (isOpen && data !== null) {
            form.setFields(getFieldsObject(data));
        } else {
            form.resetFields();
        }
    }, [isOpen, form, data]);

    const handleFormCancel = useCallback(() => {
        closeDrawer();
        setData({});
    }, [closeDrawer, setData]);

    const handleSubmit = useCallback(
        function (form) {
            if (!isFormValid(form)) return;

            onSave(form)
                .then(() => {
                    setData(null);
                    closeDrawer();
                    notification.success(
                        getNotificationConfig(t("action-success"))
                    );
                })
                .catch(() => {
                    notification.error(
                        getNotificationConfig(t("error-unexpected"))
                    );
                });
        },
        [closeDrawer, notification, onSave, setData, t]
    );

    return (
        <>
            <Drawer
                title={title}
                width={360}
                onClose={handleFormCancel}
                open={isOpen}
                styles={{
                    body: {
                        paddingBottom: 80
                    }
                }}
                extra={
                    <Space>
                        <Button onClick={handleFormCancel}>
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={() => handleSubmit(form)}
                            type="primary"
                        >
                            {t("save")}
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form} autoComplete="off">
                    {children}
                </Form>
            </Drawer>
        </>
    );
}

export default DataDrawer;
