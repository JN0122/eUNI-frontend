import { useMemo } from "react";

export default function useFieldOfStudyUpgradeRequirements() {
    return useMemo(() => {
        return {
            year: "2024/2025",
            firstHalfOfYear: true
        };
    }, []);
}
