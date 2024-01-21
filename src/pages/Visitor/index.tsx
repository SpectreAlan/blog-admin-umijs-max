import {ActionType, FooterToolbar, PageContainer, ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button, Space, Modal} from 'antd';
import React, {useRef, useState} from "react";
import {ExclamationCircleFilled} from '@ant-design/icons';

const VisitorPage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const [selectedRows, setSelectedRows] = useState<Visitor.VisitorItem[]>([]);

    const {loading: deleteLoading, run: batchDelete} = useRequest(
        (ids: string[]) => {
            return {
                method: 'DELETE',
                url: `/visitor`,
                data: {ids},
            }
        },
        {
            manual: true,
            onSuccess: () => {
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
            }
        });

    const handleDelete = (ids: string[]) => {
        Modal.confirm({
            title: '温馨提示',
            icon: <ExclamationCircleFilled/>,
            content: `确定要删除所选项吗？`,
            onOk() {
                batchDelete(ids)
            }
        });
    }
    const renderActions = (text: string, record: Visitor.VisitorItem) => (
        <Access accessible={access.canEdit} key='action'>
            <Space>
                <Button type="text" loading={deleteLoading} danger onClick={() => handleDelete([record.id])}>
                    删除
                </Button>
            </Space>
        </Access>
    );

    const columns: any[] = [
        {
            title: 'IP',
            dataIndex: 'ip',
            copyable: true
        },
        {
            title: '设备',
            dataIndex: 'device',
            hideInSearch: true
        },
        {
            title: 'OS',
            dataIndex: 'os',
            hideInSearch: true
        },
        {
            title: '组织',
            dataIndex: 'organization',
            hideInSearch: true
        },
        {
            title: '国家',
            dataIndex: 'country'
        },
        {
            title: '省份',
            dataIndex: 'province'
        },
        {
            title: '城市',
            dataIndex: 'city'
        },
        {
            title: '访问时间',
            dataIndex: 'createdAt',
            hideInSearch: true
        },
        {
            title: '操作',
            valueType: 'option',
            render: renderActions,
        },
    ]

    const {loading, run} = useRequest((params) => {
        return {
            method: 'GET',
            url: '/visitor',
            params,
        }
    }, {
        manual: true
    });

    return (
        <PageContainer>
            <ProTable<Visitor.VisitorItem>
                actionRef={actionRef}
                loading={loading}
                rowKey="id"
                search={{
                    labelWidth: 60,
                }}
                request={async (params) => {

                    const {list, total} = await run(params);
                    return {
                        data: list || [],
                        total: total || 0,
                    };
                }}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => setSelectedRows(selectedRows),
                }}
            />
            {selectedRows?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            已选择{' '}
                            <a style={{fontWeight: 600}}>{selectedRows.length}</a>{' '}
                            项&nbsp;&nbsp;
                        </div>
                    }
                >
                    <Access accessible={access.canCreate} key='add'>
                        <Button
                            loading={deleteLoading}
                            type="primary" danger
                            onClick={async () => {
                                handleDelete(selectedRows.map(item => item.id))
                            }}
                        >
                            批量删除
                        </Button>
                    </Access>
                </FooterToolbar>
            )}
        </PageContainer>
    );
};

export default VisitorPage;
