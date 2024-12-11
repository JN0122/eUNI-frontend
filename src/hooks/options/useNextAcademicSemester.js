import { useMemo } from "react";

export default function useNextAcademicSemester() {
    return useMemo(() => {
        return {
            yearNameId: 1,
            firstHalfOfYear: false.toString()
        };
    }, []);
}
