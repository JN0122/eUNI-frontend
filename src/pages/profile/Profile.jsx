import ContentBlock from "../../components/layout/ContentBlock.jsx";
import SiderMenu from "../../components/layout/SiderMenu.jsx";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";
import { SubPageProvider } from "../../context/SubPageContext.jsx";
import { useState } from "react";

function Profile() {
    const { t } = useTranslation();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    let items = [
        {
            label: <Link to="info">{t("basic-info")}</Link>,
            key: 1,
            icon: <UserOutlined />,
        },
        {
            label: t("change-password"),
            key: 2,
            icon: <LockOutlined />,
        },
        {
            label: t("change-email"),
            key: 3,
            icon: <MailOutlined />,
        },
    ];
    return (
        <SubPageProvider setBreadcrumbs={setBreadcrumbs}>
            <ContentBlock
                breadcrumbs={[{ title: t("Profil") }, ...breadcrumbs]}
                menu={
                    <SiderMenu
                        defaultOpenKeys={["sub2"]}
                        fullHeight={true}
                        items={items}
                    />
                }
            >
                <Outlet />
            </ContentBlock>
        </SubPageProvider>
    );
}

export default Profile;
