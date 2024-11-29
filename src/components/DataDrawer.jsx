import { App, Button, Drawer, Form, Space } from "antd";
import { useDrawer } from "../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
import getNotificationConfig from "../helpers/getNotificationConfig.js";

async function isFormValid(form) {
    return await form
        .validateFields()
        .then(() => true)
        .catch(() => false);
}

function getFieldsObject(data) {
    return Object.keys(data).map((key) => {
        return {
            name: key,
            value: data[key]
        };
    });
}

function DataDrawer({ title, onSave, children, ...rest }) {
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

    const handleSubmit = useCallback(
        async function (form) {
            if (!(await isFormValid(form))) return;

            onSave(form)
                .then(() => {
                    setData(null);
                    closeDrawer();
                    notification.success(
                        getNotificationConfig(t("action-success"))
                    );
                })
                .catch((error) => {
                    console.error(error);
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
                onClose={closeDrawer}
                open={isOpen}
                styles={{
                    body: {
                        paddingBottom: 80
                    }
                }}
                extra={
                    <Space>
                        <Button onClick={closeDrawer}>{t("cancel")}</Button>
                        <Button
                            onClick={() => handleSubmit(form)}
                            type="primary"
                            htmlType="submit"
                        >
                            {t("save")}
                        </Button>
                    </Space>
                }
                {...rest}
            >
                <Form layout="vertical" form={form} autoComplete="off">
                    {children}
                </Form>
            </Drawer>
        </>
    );
}

export default DataDrawer;
