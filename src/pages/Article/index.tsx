import {ActionType, FooterToolbar, PageContainer, ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button, Space, Modal, Tag } from 'antd';
import React, {useRef, useState} from "react";
import Create from "@/pages/Article/create";
import {ExclamationCircleFilled, FrownOutlined, PlusOutlined, SmileOutlined} from '@ant-design/icons';
import Comment from '@/pages/Comment/addOrEdit'

const ArticlePage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const [selectedRows, setSelectedRows] = useState<Article.ArticleItem[]>([]);
    const [id, setId] = useState<string>('');
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [drawerComment, setCommentVisible] = useState(false)

    const {loading: deleteLoading, run: batchDelete} = useRequest(
        (ids: string[]) => {
            return {
                method: 'DELETE',
                url: `/article`,
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

    const handleEdit = (record: Article.ArticleItem) => {
        setId(record.id)
        setDrawerVisible(true)
    }

    const handlePinedComment = (record: Article.ArticleItem) => {
        setId(record.id)
        setCommentVisible(true)
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
    const renderActions = (text: string, record: Article.ArticleItem) => (
        <Access accessible={access.canEdit} key='action'>
            <Space>
                <Button type="link" onClick={() => handleEdit(record)}>
                    编辑
                </Button>
                <Button type="link" onClick={() => handlePinedComment(record)}>
                    添加置顶评论
                </Button>
                <Button type="text" loading={deleteLoading} danger onClick={() => handleDelete([record.id])}>
                    删除
                </Button>
            </Space>
        </Access>
    );

    const columns: any[] = [
        {
            title: '名称',
            dataIndex: 'title'
        },
        {
            title: '封面',
            dataIndex: 'cover',
            hideInSearch: true,
            render: (_: string) => <img src={_} alt="" style={{width: '60px'}}/>
        },
        {
            title: '浏览量',
            dataIndex: 'scan',
            width: 80,
            hideInSearch: true
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 80,
            valueEnum: {
                1: {
                    text: '正常',
                    status: 'Success',
                    icon: <SmileOutlined/>,
                },
                0: {
                    text: '草稿',
                    status: 'Error',
                    icon: <FrownOutlined/>,
                }
            },
        },
        {
            title: '分类',
            dataIndex: 'category',
            valueType: 'text',
            render: (_: unknown, record: Article.ArticleItem) => record.category.title,
            hideInSearch: true
        },
        {
            title: '标签',
            dataIndex: 'tags',
            render: (_: unknown, record: Article.ArticleItem) => record.tags.map(item=>(<Tag color="cyan" key={item._id}>{item.title}</Tag>)),
            hideInSearch: true
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            hideInSearch: true
        },
        {
            title: '最后更新',
            dataIndex: 'updatedAt',
            hideInSearch: true
        },
        {
            title: '操作',
            valueType: 'option',
            render: renderActions
        },
    ]

    const {loading, run} = useRequest((params) => {
        return {
            method: 'GET',
            url: '/article',
            params,
        }
    }, {
        manual: true
    });

    return (
        <PageContainer header={{title: false}}>
            {
                drawerVisible ? <Create setDrawerVisible={setDrawerVisible} id={id} actionRef={actionRef}/> : null
            }

            {
                drawerComment ? <Comment setDrawerVisible={setCommentVisible} article={id} actionRef={actionRef} type='pinned' id='-1'/> : null
            }
            <ProTable<Article.ArticleItem>
                scroll={{ x: 'max-content' }}
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
                            新建文章
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

export default ArticlePage;
