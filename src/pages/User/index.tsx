import {ActionType, FooterToolbar, PageContainer,  ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button} from 'antd';
import React, {useRef, useState} from "react";

const UserPage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const columns: any[] = [
        {
            title: '账号',
            dataIndex: 'account',
            tip: '账号是唯一的 key',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '账号为必填项',
                    },
                ],
            },
        },
        {
            title: 'Email',
            dataIndex: 'email'
        }
    ]
    const [selectedRowsState, setSelectedRows] = useState<User.UserItem[]>([]);
    const {loading, run} = useRequest((params) => {
        return {
            method: 'GET',
            url: '/user',
            params,
        }
    }, {
        manual: true
    });
    return (
        <PageContainer>
            <ProTable<User.UserItem>
                actionRef={actionRef}
                loading={loading}
                rowKey="id"
                search={{
                    labelWidth: 60,
                }}
                toolBarRender={() => [
                    <Access accessible={access.canCreate} key='add'>
                        <Button
                            key="add"
                            type="primary"
                            onClick={() => {
                            }}
                        >
                            新建
                        </Button>,
                    </Access>
                ]}
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
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            已选择{' '}
                            <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
                            项&nbsp;&nbsp;
                        </div>
                    }
                >
                    <Access accessible={access.canCreate} key='add'>
                        <Button
                            type="primary" danger
                            onClick={async () => {
                                setSelectedRows([]);
                                actionRef.current?.reloadAndRest?.();
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

export default UserPage;
