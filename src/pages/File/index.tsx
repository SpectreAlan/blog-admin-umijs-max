import {ActionType, PageContainer, ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button, Space, Modal} from 'antd';
import React, {useRef, useState} from "react";
import AddOrEdit from "@/pages/File/addOrEdit";
import {ExclamationCircleFilled, PlusOutlined} from '@ant-design/icons';

const FilePage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const [id, setId] = useState<string>('');
    const [drawerVisible, setDrawerVisible] = useState(false)

    const {loading: deleteLoading, run: fileDelete} = useRequest(
        (id: string) => {
            return {
                method: 'DELETE',
                url: `/file/${id}`,
            }
        },
        {
            manual: true,
            onSuccess: () => {
                actionRef?.current?.reloadAndRest?.();
            }
        });

    const handleDelete = (id:string) => {
        Modal.confirm({
            title: '温馨提示',
            icon: <ExclamationCircleFilled/>,
            content: `确定要删除所选项吗？`,
            onOk() {
                fileDelete(id)
            }
        });
    }
    const renderActions = (text: string, record: File.FileItem) => (
        <Access accessible={access.canEdit} key='action'>
            <Space>
                <Button type="text" danger onClick={() => handleDelete(record.id!)}>
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
            title: '预览',
            dataIndex: 'id',
            hideInSearch: true,
            render: (_: string, record:File.FileItem) => <img src={record.url} alt="" style={{width: '60px'}}/>
        },
        {
            title: '描述',
            dataIndex: 'description'
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
        <PageContainer header={{title: false}}>
            {
                drawerVisible ? <AddOrEdit setDrawerVisible={setDrawerVisible} id={id} actionRef={actionRef}/> : null
            }
            <ProTable<File.FileItem>
                scroll={{ x: 'max-content' }}
                actionRef={actionRef}
                loading={loading || deleteLoading}
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
            />
        </PageContainer>
    );
};

export default FilePage;
