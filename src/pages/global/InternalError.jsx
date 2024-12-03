import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import AppLayout from "../../components/layout/AppLayout.jsx";

export default function InternalError() {
    const { t } = useTranslation();

    return (
        <AppLayout centerChildren={true} showHeaderLogo={true}>
            <Result
                status="500"
                title="500"
                subTitle={t("something-went-wrong")}
                extra={
                    <Button
                        type="primary"
                        onClick={() => window.history.back()}
                    >
                        {t("go-back")}
                    </Button>
                }
            />
        </AppLayout>
    );
}
