import {
    DrawerForm, ProFormRadio,
    ProFormText,
} from '@ant-design/pro-components';
import {Form} from 'antd';
import {useEffect} from "react";
import {useRequest} from "@umijs/max";
import {CommonType} from "@/types/common.typings";

const AddOrEdit: React.FC<CommonType.IProps> = ({setDrawerVisible, id, actionRef}) => {
    const [form] = Form.useForm();

    const {loading, run: queryRun} = useRequest(`/setting/${id}`,
        {
            manual: true,
            onSuccess: (res) => {
                form.setFieldsValue(res)
            }
        });

    const {loading: saveLoading, run: saveRun} = useRequest(
        (data: Setting.SettingItem) => {
            if (id) {
                return {
                    method: 'PATCH',
                    url: `/setting/${id}`,
                    data,
                }
            }
            return {
                method: 'POST',
                url: `/setting`,
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
        <DrawerForm<Setting.SettingItem>
            loading={loading || saveLoading}
            onOpenChange={setDrawerVisible}
            open={true}
            title={id ? '编辑配置' : '新建配置'}
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
                name="title"
                width="md"
                label="名称"
                placeholder="请输入名称"
                rules={[{required: true}]}
            />
            <ProFormText
                name="key"
                width="md"
                label="Key"
                placeholder="请输入key"
                rules={[{required: true}]}
            />
            <ProFormText
                name="value"
                width="md"
                label="Value"
                placeholder="请输入value"
                rules={[{required: true}]}
            />
            <ProFormRadio.Group
                name="type"
                label="类型"
                options={[
                    {
                        label: '用户配置',
                        value: 'custom',
                    },
                    {
                        label: '系统配置',
                        value: 'system',
                    },
                ]}
                rules={[{required: true}]}
            />
        </DrawerForm>
    );
};

export default AddOrEdit