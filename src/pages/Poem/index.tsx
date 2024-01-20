import {ActionType, FooterToolbar, PageContainer, ProTable} from '@ant-design/pro-components';
import {Access, useAccess, useRequest} from '@umijs/max';
import {Button} from 'antd';
import React, {useRef, useState} from "react";
import AddOrEdit from "@/pages/Poem/addOrEdit";

const PoemPage: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const columns: any[] = [
        {
            title: '内容',
            dataIndex: 'content',
        },
        {
            title: '来源',
            dataIndex: 'author'
        },
        {
            title: '类型',
            dataIndex: 'type'
        }
    ]
    const [selectedRowsState, setSelectedRows] = useState<Poem.PoemItem[]>([]);
    const {loading, run} = useRequest((params) => {
        return {
            method: 'GET',
            url: '/poem',
            params,
        }
    }, {
        manual: true
    });
    const {loading: deleteLoading, run: batchDelete} = useRequest((ids: string[]) => {
        return {
            method: 'DELETE',
            url: `/poem`,
            data: {ids},
        }
    }, {
        manual: true,
        onSuccess: () => {
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
        }
    });
    return (
        <PageContainer>
            <ProTable<Poem.PoemItem>
                actionRef={actionRef}
                loading={loading}
                rowKey="id"
                search={{
                    labelWidth: 60,
                }}
                toolBarRender={() => [
                    <Access accessible={access.canCreate} key='add'>
                        <AddOrEdit/>
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
                            loading={deleteLoading}
                            type="primary" danger
                            onClick={async () => {
                                batchDelete(selectedRowsState.map(item => item.id))
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

export default PoemPage;
