import {
    DrawerForm,
    ProFormText,
} from '@ant-design/pro-components';
import {Form} from 'antd';
import {useEffect} from "react";
import {useRequest} from "@umijs/max";
import {CommonType} from "@/types/common.typings";

const AddOrEdit: React.FC<CommonType.IProps> = ({setDrawerVisible, id, actionRef}) => {
    const [form] = Form.useForm();

    const {loading, run: queryRun} = useRequest(`/log/${id}`,
        {
            manual: true,
            onSuccess: (res) => {
                form.setFieldsValue(res)
            }
        });

    const {loading: saveLoading, run: saveRun} = useRequest(
        (data: Log.LogItem) => {
            if (id) {
                return {
                    method: 'PATCH',
                    url: `/log/${id}`,
                    data,
                }
            }
            return {
                method: 'POST',
                url: `/log`,
                data,
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
        if (id) {
            queryRun()
        }
    }, [])

    return (
        <DrawerForm<Log.LogItem>
            loading={loading || saveLoading}
            onOpenChange={setDrawerVisible}
            open={true}
            title={id ? '编辑一言' : '新建一言'}
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