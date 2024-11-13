function ScheduleCell({ cellData }) {
    if (cellData == null) return null;

    return (
        <div
            style={{
                padding: "0.5em",
                width: "min-content",
                margin: "auto"
            }}
        >
            {cellData.name}
            <div>{cellData.room}</div>
        </div>
    );
}

export default ScheduleCell;
