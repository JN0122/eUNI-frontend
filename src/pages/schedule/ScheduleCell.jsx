function ScheduleCell({ cellData }) {
    if (!Object.keys(cellData).length) return null;

    return (
        <div
            style={{
                padding: "0.5em",
                width: "min-content",
                margin: "auto",
            }}
        >
            {cellData.name}
            <div>{cellData.room}</div>
        </div>
    );
}

export default ScheduleCell;
