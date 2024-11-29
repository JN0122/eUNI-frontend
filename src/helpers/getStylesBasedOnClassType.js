import CLASSES_TYPE from "../enums/classesType.js";

export default function (classType) {
    const styles = {
        padding: 0,
        verticalAlign: "middle",
        borderColor: "transparent",
        minWidth: "10rem"
    };

    switch (classType) {
        case CLASSES_TYPE.lecture:
            styles.backgroundColor = "#ffcccc";
            break;
        case CLASSES_TYPE.deanGroup:
            styles.backgroundColor = "#dfcffa";
            break;
        case CLASSES_TYPE.laboratory:
            styles.backgroundColor = "#d3d9f5";
            break;
        case CLASSES_TYPE.project:
            styles.backgroundColor = "#f0e3d6";
            break;
        case CLASSES_TYPE.computer:
            styles.backgroundColor = "#ececd2";
            break;
        case -1:
            styles.backgroundColor = "#d4ecd2";
            break;
    }
    return styles;
}
