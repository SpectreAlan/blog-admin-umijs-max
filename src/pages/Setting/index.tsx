import {ActionType, PageContainer, ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button, Space, Modal, message} from 'antd';
import React, {useRef, useState} from "react";
import AddOrEdit from "@/pages/Setting/addOrEdit";
import {ExclamationCircleFilled, PlusOutlined} from '@ant-design/icons';

const SettingPage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const [id, setId] = useState<string>('');
    const [drawerVisible, setDrawerVisible] = useState(false)

    const {loading: deleteLoading, run: deleteRun} = useRequest(
        (id: string) => {
            return {
                method: 'DELETE',
                url: `/setting/${id}`
            }
        },
        {
            manual: true,
            onSuccess: () => {
                actionRef?.current?.reloadAndRest?.();
            }
        });

    const handleEdit = (record: Setting.SettingItem) => {
        setId(record.id)
        setDrawerVisible(true)
    }
    const handleDelete = (item: Setting.SettingItem) => {
        if (item.type === 'system') {
            message.error('系统配置禁止删除')
            return
        }
        Modal.confirm({
            title: '温馨提示',
            icon: <ExclamationCircleFilled/>,
            content: `确定要删除所选项吗？`,
            onOk() {
                deleteRun(item.id)
            }
        });
    }
    const renderActions = (text: string, record: Setting.SettingItem) => (
        <Access accessible={access.canEdit} key='action'>
            <Space>
                <Button type="link" onClick={() => handleEdit(record)}>
                    编辑
                </Button>
                <Button type="text" loading={deleteLoading} danger onClick={() => handleDelete(record)}>
                    删除
                </Button>
            </Space>
        </Access>
    );

    const columns: any[] = [
        {
            title: '名称',
            dataIndex: 'title',
        },
        {
            title: 'Key',
            dataIndex: 'key',
        },
        {
            title: '类型',
            dataIndex: 'type',
            hideInSearch: true,
            valueEnum: {
                system: {text: '系统配置'},
                custom: {text: '用户配置'},
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            hideInSearch: true
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
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
            url: '/setting',
            params,
        }
    }, {
        manual: true
    });

    return (
        <PageContainer header={{title: false}}>
            {
                drawerVisible ? <AddOrEdit setDrawerVisible={setDrawerVisible} id={id} actionRef={actionRef}/> : null
            }
            <ProTable<Setting.SettingItem>
                scroll={{x: 'max-content'}}
                actionRef={actionRef}
                loading={loading}
                rowKey="id"
                search={{
                    labelWidth: 60,
                }}
                toolBarRender={() => [
                    <Access accessible={access.canCreate} key='add'>
                        <Button type="primary" onClick={() => {
                            setId('')
                            setDrawerVisible(true)
                        }}>
                            <PlusOutlined/>
                            新建配置
                        </Button>
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
            />
        </PageContainer>
    );
};

export default SettingPage;
