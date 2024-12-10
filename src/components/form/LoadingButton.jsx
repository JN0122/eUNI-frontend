import { useCallback, useState } from "react";
import { Button } from "antd";

export default function LoadingButton({ onClick, children, ...rest }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleLoading = useCallback(
        async function () {
            setIsLoading(true);
            await onClick();
            setIsLoading(false);
        },
        [onClick]
    );

    return (
        <Button onClick={handleLoading} loading={isLoading} {...rest}>
            {children}
        </Button>
    );
}
