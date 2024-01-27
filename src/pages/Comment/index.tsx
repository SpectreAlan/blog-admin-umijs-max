import {ActionType, FooterToolbar, PageContainer, ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button, Space, Modal} from 'antd';
import React, {useRef, useState} from "react";
import AddOrEdit from "@/pages/Comment/addOrEdit";
import {ExclamationCircleFilled, FrownOutlined, SmileOutlined} from '@ant-design/icons';

const CommentPage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const [selectedRows, setSelectedRows] = useState<Comment.CommentItem[]>([]);
    const [id, setId] = useState<string>('');
    const [article, setArticle] = useState<string>('');
    const [type, setType] = useState<string>('reply');
    const [drawerVisible, setDrawerVisible] = useState(false)

    const {loading: deleteLoading, run: batchDelete} = useRequest(
        (ids: string[]) => {
            return {
                method: 'DELETE',
                url: `/comment`,
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

    const handleEdit = (record: Comment.CommentItem) => {
        setType('approval')
        setId(record.id)
        setDrawerVisible(true)
    }

    const handleReply = (record: Comment.CommentItem) => {
        setType('reply')
        setId(record.id)
        setArticle(record.article)
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
    const renderActions = (text: string, record: Comment.CommentItem) => (
        <Access accessible={access.canEdit} key='action'>
            <Access accessible={access.canCreate} key='add'>
                <Space>
                    {
                        !record.author && <>
                            {
                                !record.status && <Button type="link" onClick={() => handleEdit(record)}>
                                    审核
                                </Button>
                            }
                            <Button type="link" onClick={() => handleReply(record)}>
                                回复
                            </Button>
                        </>
                    }
                    <Button type="text" loading={deleteLoading} danger onClick={() => handleDelete([record.id])}>
                        删除
                    </Button>
                </Space>
            </Access>
        </Access>
    );

    const columns: any[] = [
        {
            title: '评论',
            dataIndex: 'content'
        },
        {
            title: '博文',
            dataIndex: 'article',
            render: (_: any) => _.title,
            hideInSearch: true
        },
        {
            title: '昵称',
            dataIndex: 'nickName'
        },
        {
            title: '邮箱',
            dataIndex: 'email'
        },
        {
            title: '类型',
            dataIndex: 'author',
            render: (_: boolean, info: Comment.CommentItem) => info.pinned ? '置顶评论' : (_ ? '博主回复' : '用户评论')
        },
        {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
                1: {
                    text: '审核通过',
                    status: 'Success',
                    icon: <SmileOutlined/>,
                },
                0: {
                    text: '待审核',
                    status: 'Error',
                    icon: <FrownOutlined/>,
                }
            },
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
            url: '/comment',
            params,
        }
    }, {
        manual: true
    });

    return (
        <PageContainer header={{title: false}}>
            {
                drawerVisible ?
                    <AddOrEdit setDrawerVisible={setDrawerVisible} id={id} actionRef={actionRef} type={type} article={article}/> : null
            }
            <ProTable<Comment.CommentItem>
                scroll={{ x: 'max-content' }}
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

export default CommentPage;
