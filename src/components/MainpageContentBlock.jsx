import ContentBlock from "./ContentBlock.jsx";
import SiderMenu from "./SiderMenu.jsx";
import { Outlet } from "react-router-dom";
import { useSubPage } from "../context/SubPageContentBlockContext.jsx";

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
