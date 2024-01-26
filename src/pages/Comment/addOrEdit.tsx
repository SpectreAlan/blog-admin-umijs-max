import {
    DrawerForm, ProFormSwitch,
    ProFormText,
} from '@ant-design/pro-components';
import {Form} from 'antd';
import {useEffect} from "react";
import {useRequest} from "@umijs/max";
import {CommonType} from "@/types/common.typings";


const AddOrEdit: React.FC<CommonType.IProps &
    { type: string, article?: string }> = ({
                                               setDrawerVisible,
                                               id,
                                               actionRef,
                                               type,
                                               article
                                           }) => {
    const [form] = Form.useForm();

    const {loading, run: queryRun} = useRequest(`/comment/${id}`,
        {
            manual: true,
            onSuccess: (res) => {
                form.setFieldsValue(res)
            }
        });

    const {loading: saveLoading, run: saveRun} = useRequest(
        (data: Comment.CommentItem) => {
            if (type === 'approval') {
                return {
                    method: 'PATCH',
                    url: `/comment/${id}`,
                    data,
                }
            }
            return {
                method: 'POST',
                url: `/comment`,
                data: {
                    ...data,
                    author: 1,
                    status: 1,
                    parentId: id,
                    article,
                    ...(type === 'pinned' && {pinned: true})
                },
            }
        },
        {
            manual: true,
            onSuccess: () => {
                setDrawerVisible(false);
                actionRef?.current?.reloadAndRest?.();
            }
        });

    useEffect(() => {
        if (id && type === 'approval') {
            queryRun()
        }
    }, [])

    return (
        <DrawerForm<Comment.CommentItem>
            loading={loading || saveLoading}
            onOpenChange={setDrawerVisible}
            open={true}
            title={type === 'approval' ? '评论审核' : type === 'reply' ? '回复' : '创建置顶评论'}
            form={form}
            autoFocusFirstInput
            drawerProps={{
                destroyOnClose: true,
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
                saveRun(values)
            }}
        >
            <ProFormText
                name="content"
                width="md"
                label="内容"
                placeholder="请输入内容"
                rules={[{required: true}]}
            />
            {
                type === 'approval' ? <ProFormSwitch
                    name="status"
                    label="状态"
                    fieldProps={{checkedChildren: '审核通过', unCheckedChildren: '待审核'}}
                    rules={[{required: true}]}
                /> : null
            }

        </DrawerForm>
    );
};

export default AddOrEdit