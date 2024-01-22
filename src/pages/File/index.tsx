import {ActionType, FooterToolbar, PageContainer, ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button, Space, Modal} from 'antd';
import React, {useRef, useState} from "react";
import AddOrEdit from "@/pages/File/addOrEdit";
import {ExclamationCircleFilled, PlusOutlined} from '@ant-design/icons';

const FilePage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const [selectedRows, setSelectedRows] = useState<File.FileItem[]>([]);
    const [id, setId] = useState<string>('');
    const [drawerVisible, setDrawerVisible] = useState(false)

    const {loading: deleteLoading, run: batchDelete} = useRequest(
        (ids: string[]) => {
            return {
                method: 'DELETE',
                url: `/file`,
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

    const handleEdit = (record: File.FileItem) => {
        setId(record.id)
        setDrawerVisible(true)
    }
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
    const renderActions = (text: string, record: File.FileItem) => (
        <Access accessible={access.canEdit} key='action'>
            <Space>
                <Button type="link" onClick={() => handleEdit(record)}>
                    编辑
                </Button>
                <Button type="text" loading={deleteLoading} danger onClick={() => handleDelete([record.id])}>
                    删除
                </Button>
            </Space>
        </Access>
    );

    const columns: any[] = [
        {
            title: '链接',
            dataIndex: 'url',
            copyable: true
        },
        {
            title: '描述',
            dataIndex: 'description',
            hideInSearch: true
        },
        {
            title: '上传时间',
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
            url: '/file',
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
            <ProTable<File.FileItem>
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
                            上传文件
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

export default FilePage;
