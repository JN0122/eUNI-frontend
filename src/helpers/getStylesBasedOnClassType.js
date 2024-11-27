import CLASSES_TYPE from "../enums/classesType.js";

export default function (classType) {
    const styles = {
        padding: 0,
        verticalAlign: "middle",
        borderColor: "transparent"
    };

    switch (classType) {
        case CLASSES_TYPE.lecture:
            styles.backgroundColor = "#ccebff";
            break;
        case CLASSES_TYPE.deanGroup:
            styles.backgroundColor = "#cfe4fa";
            break;
        case CLASSES_TYPE.laboratory:
            styles.backgroundColor = "#d3def5";
            break;
        case CLASSES_TYPE.project:
            styles.backgroundColor = "#d6d8f0";
            break;
        case CLASSES_TYPE.computer:
            styles.backgroundColor = "#d9d2ec";
            break;
    }
    return styles;
}
