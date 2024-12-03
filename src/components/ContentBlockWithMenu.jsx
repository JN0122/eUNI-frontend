import ContentBlock from "./ContentBlock.jsx";
import SiderMenu from "./SiderMenu.jsx";
import { Outlet } from "react-router-dom";
import { useContentBlock } from "../hooks/useContentBlock.jsx";
import { useMediaQuery } from "react-responsive";

function ContentBlockWithMenu() {
    const { breadcrumbs, items, activeSubPageKey } = useContentBlock();
    const isSmallScreen = useMediaQuery({ maxWidth: 600 });
    let itemsOnlyIcon = null;

    if (isSmallScreen) {
        itemsOnlyIcon = items.map((item) => {
            const newItem = {
                ...item,
                label: {
                    ...item.label,
                    props: { ...item.label.props, children: null }
                }
            };
            return newItem;
        });
    }

    return (
        <ContentBlock
            breadcrumbs={breadcrumbs}
            menu={
                <SiderMenu
                    fullHeight={true}
                    items={itemsOnlyIcon || items}
                    activeKey={activeSubPageKey}
                />
            }
        >
            <Outlet />
        </ContentBlock>
    );
}

export default ContentBlockWithMenu;
