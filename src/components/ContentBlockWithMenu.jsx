import ContentBlock from "./ContentBlock.jsx";
import SiderMenu from "./SiderMenu.jsx";
import { Outlet } from "react-router-dom";
import { useContentBlock } from "../context/ContentBlockContext.jsx";

function ContentBlockWithMenu() {
    const { breadcrumbs, items, activeSubPageKey } = useContentBlock();

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

export default ContentBlockWithMenu;
