import {ActionType, FooterToolbar, PageContainer, ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button, Space, Modal} from 'antd';
import React, {useRef, useState} from "react";
import {ExclamationCircleFilled} from '@ant-design/icons';

const LogPage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const [selectedRows, setSelectedRows] = useState<Log.LogItem[]>([]);

    const {loading: deleteLoading, run: batchDelete} = useRequest(
        (ids: string[]) => {
            return {
                method: 'DELETE',
                url: `/log`,
                data: {ids},
            }
        },
        {
            manual: true,
            onSuccess: () => {
                setSelectedRows([]);
                actionRef?.current?.reloadAndRest?.();
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
    const renderActions = (text: string, record: Log.LogItem) => (
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
            title: '状态码',
            dataIndex: 'status'
        },
        {
            title: '请求方式',
            dataIndex: 'method',
        },
        {
            title: '请求地址',
            dataIndex: 'url'
        },
        {
            title: 'Query',
            dataIndex: 'query',
            hideInSearch: true
        },
        {
            title: 'Body',
            dataIndex: 'body',
            hideInSearch: true
        },
        {
            title: '错误信息',
            dataIndex: 'message',
            hideInSearch: true
        },
        {
            title: 'userAgent',
            dataIndex: 'userAgent',
            hideInSearch: true
        },
        {
            title: '创建时间',
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
            url: '/log',
            params,
        }
    }, {
        manual: true
    });

    return (
        <PageContainer header={{title: false}}>
            <ProTable<Log.LogItem>
                scroll={{ x: 'max-content' }}
                actionRef={actionRef}
                loading={loading}
                rowKey="id"
                search={{
                    labelWidth: 70,
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

export default LogPage;
