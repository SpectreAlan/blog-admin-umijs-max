import {
    ActionType,
    DrawerForm,
    ProFormText,
} from '@ant-design/pro-components';
import {Form} from 'antd';
import {useEffect} from "react";
import {useRequest} from "@@/exports";

interface IProps {
    actionRef: React.MutableRefObject<ActionType | undefined>
    id: string
    setDrawerVisible: (visible: boolean) => void
}


const AddOrEdit: React.FC<IProps> = ({setDrawerVisible, id, actionRef}) => {
    const [form] = Form.useForm();

    const {loading, run: queryRun} = useRequest(`/poem/${id}`,
        {
            manual: true,
            onSuccess: (res) => {
                form.setFieldsValue(res)
            }
        });

    const {loading: saveLoading, run: saveRun} = useRequest(
        (data: Poem.PoemItem) => {
            if (id) {
                return {
                    method: 'PATCH',
                    url: `/poem/${id}`,
                    data,
                }
            }
            return {
                method: 'POST',
                url: `/poem`,
                data,
            }
        },
        {
            manual: true,
            onSuccess: () => {
                setDrawerVisible(false);
                actionRef.current?.reloadAndRest?.();
            }
        });

    useEffect(() => {
        if (id) {
            queryRun()
        }
    }, [])

    return (
        <DrawerForm<Poem.PoemItem>
            loading={loading || saveLoading}
            onOpenChange={setDrawerVisible}
            open={true}
            title={id ? '编辑一言' : '新建一言'}
            resize={{
                onResize() {
                    console.log('resize!');
                },
                maxWidth: window.innerWidth * 0.8,
                minWidth: 300,
            }}
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
            <ProFormText
                name="author"
                width="md"
                label="来源"
                placeholder="请输入来源"
                rules={[{required: true}]}
            />
            <ProFormText
                name="type"
                width="md"
                label="类型"
                placeholder="请输入类型"
                rules={[{required: true}]}
            />
        </DrawerForm>
    );
};

export default AddOrEdit