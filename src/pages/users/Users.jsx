import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Button, Flex, Skeleton, Table } from "antd";
import { getAllUsers } from "../../api/users.js";

function Users() {
    const { t } = useTranslation();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const columns = [
        {
            title: t("first-name"),
            dataIndex: "firstName",
        },
        {
            title: t("last-name"),
            dataIndex: "lastName",
        },
        {
            title: t("email"),
            dataIndex: "email",
        },
    ];

    async function fetchAllUsers() {
        const users = await getAllUsers();
        setDataSource(
            users.data.map((user) => {
                return {
                    key: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                };
            }),
        );
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const start = () => {
        setLoading(true);

        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys) => {
        console.log(
            "selectedRowKeys changed: ",
            dataSource.find((el) => el.key === newSelectedRowKeys[0]),
        );
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
        <ContentBlock breadcrumbs={[{ title: t("all-users") }]}>
            {dataSource.length === 0 ? (
                <Skeleton loading />
            ) : (
                <Flex gap="middle" vertical>
                    <Flex align="center" gap="middle">
                        <Button
                            type="primary"
                            onClick={start}
                            disabled={!hasSelected}
                            loading={loading}
                        >
                            Reload
                        </Button>
                        {hasSelected
                            ? `Selected ${selectedRowKeys.length} items`
                            : null}
                    </Flex>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataSource}
                    />
                </Flex>
            )}
        </ContentBlock>
    );
}

export default Users;
