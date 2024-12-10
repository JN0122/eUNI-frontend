import { useMemo } from "react";

export default function useAcademicYears() {
    return useMemo(() => {
        return [
            {
                value: 1,
                label: "2024/2025"
            }
        ];
    }, []);
}
