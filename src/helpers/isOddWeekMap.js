export default function (isOddWeek) {
    switch (isOddWeek) {
        case null:
            return "every-week";
        case true:
            return "every-odd-week";
        case false:
            return "every-even-week";
    }
}
