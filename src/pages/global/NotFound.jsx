import AppLayout from "../../components/layout/AppLayout.jsx";
import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";

function NotFound() {
    const { t } = useTranslation();

    return (
        <AppLayout centerChildren={true} showHeaderLogo={true}>
            <Result
                status="404"
                title="404"
                subTitle={t("page-not-found")}
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

export default NotFound;
