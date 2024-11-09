import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { Table } from "antd";

function Schedule() {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("hour"),
            dataIndex: "key",
            rowScope: "row",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Age",
            dataIndex: "age",
        },
        {
            title: "Home phone",
            dataIndex: "tel",
            onCell: (_, index) => {
                if (index === 3) {
                    return {
                        rowSpan: 3,
                    };
                }
                if (index >= 3 && index <= 5) {
                    return {
                        rowSpan: 0,
                    };
                }
                return {};
            },
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
    ];
    const data = [
        {
            key: "7:30-9:00",
            name: "zajęcia1",
            age: 32,
            tel: "0571-22098909",
            phone: 18889898989,
            address: "New York No. 1 Lake Park",
        },
        {
            key: "2",
            name: "Jim Green",
            tel: "0571-22098333",
            phone: 18889898888,
            age: 42,
            address: "London No. 1 Lake Park",
        },
        {
            key: "3",
            name: "Joe Black",
            age: 32,
            tel: "0575-22098909",
            phone: 18900010002,
            address: "Sydney No. 1 Lake Park",
        },
        {
            key: "4",
            name: "Jim Red",
            age: 18,
            tel: "0575-22098909",
            phone: 18900010002,
            address: "London No. 2 Lake Park",
        },
        {
            key: "5",
            name: "Jake White",
            age: 18,
            phone: 18900010002,
            address: "Dublin No. 2 Lake Park",
        },
        {
            key: "6",
            name: "Jake White",
            age: 18,
            phone: 18900010002,
            address: "Dublin No. 2 Lake Park",
        },
    ];

    return (
        <ContentBlock breadcrumbs={[{ title: t("schedule") }]}>
            <Table
                pagination={false}
                columns={columns}
                dataSource={data}
                scroll={{
                    x: "max-content",
                }}
            />
        </ContentBlock>
    );
}

export default Schedule;
