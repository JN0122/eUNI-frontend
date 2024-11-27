export function isOddWeekMap(isOddWeek) {
    switch (isOddWeek) {
        case null:
            return "every-week";
        case true:
            return "every-odd-week";
        case false:
            return "every-even-week";
    }
}

export const oddWeekValues = [null, true, false];
