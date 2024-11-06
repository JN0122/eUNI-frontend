import ContentBlock from "./layout/ContentBlock.jsx";
import SiderMenu from "./layout/SiderMenu.jsx";
import { Outlet } from "react-router-dom";
import { useSubPage } from "../context/SubPageContext.jsx";

function MainpageContentBlock() {
    const { breadcrumbs, items, activeSubPageKey } = useSubPage();

    return (
        <ContentBlock
            breadcrumbs={breadcrumbs}
            menu={
                <SiderMenu
                    fullHeight={true}
                    items={items}
                    activeKey={activeSubPageKey}
                />
            }
        >
            <Outlet />
        </ContentBlock>
    );
}

export default MainpageContentBlock;
