import AppLayout from "../../components/layout/AppLayout.jsx";
import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { goBack } from "../../helpers/goBack.js";

function NotFound() {
    const { t } = useTranslation();

    return (
        <AppLayout centerChildren={true} showHeaderLogo={true}>
            <Result
                status="404"
                title="404"
                subTitle={t("page-not-found")}
                extra={
                    <Button type="primary" onClick={goBack}>
                        {t("go-back")}
                    </Button>
                }
            />
        </AppLayout>
    );
}

export default NotFound;
