import CLASSES_TYPE from "../enums/classesType.js";

export default function (classType) {
    const styles = {
        padding: 0,
        verticalAlign: "middle",
        border: "3px solid transparent",
        borderRadius: "10px",
        color: "white"
    };

    switch (classType) {
        case CLASSES_TYPE.lecture:
            styles.backgroundColor = "#55BBFF";
            break;
        case CLASSES_TYPE.deanGroup:
            styles.backgroundColor = "#60A6EF";
            break;
        case CLASSES_TYPE.laboratory:
            styles.backgroundColor = "#6B92DE";
            break;
        case CLASSES_TYPE.project:
            styles.backgroundColor = "#767DCE";
            break;
        case CLASSES_TYPE.computer:
            styles.backgroundColor = "#8168BE";
            break;
    }
    return styles;
}
