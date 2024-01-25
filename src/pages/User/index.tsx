import {ActionType, FooterToolbar, PageContainer, ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button, Avatar, Tag, Space, Modal} from 'antd';
import React, {useRef, useState} from "react";
import {SmileOutlined, FrownOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import AddOrEdit from "@/pages/User/addOrEdit";

const UserPage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const [selectedRows, setSelectedRows] = useState<User.UserItem[]>([]);

    const [id, setId] = useState<string>('');
    const [drawerVisible, setDrawerVisible] = useState(false)

    const {loading: deleteLoading, run: batchDelete} = useRequest(
        (ids: string[]) => {
            return {
                method: 'DELETE',
                url: `/user`,
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
    const handleEdit = (record: Poem.PoemItem) => {
        setId(record.id)
        setDrawerVisible(true)
    }
    const renderActions = (text: string, record: Poem.PoemItem) => (
        <Space>
            <Button type="link" onClick={() => handleEdit(record)}>
                编辑
            </Button>
            <Button type="text" loading={deleteLoading} danger onClick={() => handleDelete([record.id])}>
                删除
            </Button>
        </Space>
    );
    const columns: any[] = [
        {
            title: '账号',
            dataIndex: 'account',
        },
        {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
                1: {
                    text: '正常',
                    status: 'Success',
                    icon: <SmileOutlined/>,
                },
                0: {
                    text: '禁用',
                    status: 'Error',
                    icon: <FrownOutlined/>,
                }
            },
        },
        {
            title: '昵称',
            dataIndex: 'nickName',
            hideInSearch: true
        },
        {
            title: '角色',
            dataIndex: 'role',
            valueEnum: {
                admin: {text: '管理员'},
                default: {text: '普通用户'},
            }
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            hideInSearch: true,
            render: (avatar: string, user: User.UserItem) => <Avatar src={avatar} alt={user.nickName} size={40}/>
        },
        {
            title: '创建时间',
            hideInSearch: true,
            dataIndex: 'createdAt'
        },
        {
            title: '更新时间',
            hideInSearch: true,
            dataIndex: 'updatedAt'
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
            url: '/user',
            params,
        }
    }, {
        manual: true
    });
    return (
        <PageContainer>
            {
                drawerVisible ? <AddOrEdit setDrawerVisible={setDrawerVisible} id={id} actionRef={actionRef}/> : null
            }
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
                                setId('')
                                setDrawerVisible(true)
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

export default UserPage;
