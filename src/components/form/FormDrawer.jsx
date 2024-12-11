import { Button, Drawer, Form, Space } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../hooks/useDrawer.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";

function FormDrawer({
    title,
    onSubmit,
    children,
    valuesOnEdit,
    valuesOnCreate = {},
    ...rest
}) {
    const { isOpen, closeDrawer, type } = useDrawer();
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleSubmit = useCallback(
        async function () {
            return await form
                .validateFields()
                .then(() => {
                    switch (type) {
                        case DRAWER_TYPE.edit:
                            onSubmit.edit(form.getFieldsValue(true));
                            break;
                        case DRAWER_TYPE.create:
                            onSubmit.create(form.getFieldsValue(true));
                            break;
                    }
                    closeDrawer();
                })
                .catch(() => {});
        },
        [closeDrawer, form, onSubmit, type]
    );

    useEffect(() => {
        if (isOpen) form.resetFields();
    }, [form, isOpen]);

    return (
        <Drawer
            title={type === DRAWER_TYPE.edit ? title.edit : title.create}
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
                        onClick={handleSubmit}
                        type="primary"
                        htmlType="submit"
                    >
                        {t("save")}
                    </Button>
                </Space>
            }
        >
            <Form
                layout="vertical"
                autoComplete="off"
                form={form}
                initialValues={
                    type === DRAWER_TYPE.edit ? valuesOnEdit : valuesOnCreate
                }
                {...rest}
            >
                {children}
            </Form>
        </Drawer>
    );
}

export default FormDrawer;
