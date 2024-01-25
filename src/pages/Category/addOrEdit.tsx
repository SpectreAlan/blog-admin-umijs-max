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

    const {loading, run: queryRun} = useRequest(`/category/${id}`,
        {
            manual: true,
            onSuccess: (res) => {
                form.setFieldsValue(res)
            }
        });

    const {loading: saveLoading, run: saveRun} = useRequest(
        (data: Category.CategoryItem) => {
            if (id) {
                return {
                    method: 'PATCH',
                    url: `/category/${id}`,
                    data,
                }
            }
            return {
                method: 'POST',
                url: `/category`,
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
        <DrawerForm<Category.CategoryItem>
            loading={loading || saveLoading}
            onOpenChange={setDrawerVisible}
            open={true}
            title={id ? '编辑分类' : '新建分类'}
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
                name="title"
                width="md"
                label="名称"
                placeholder="请输入名称"
                rules={[{required: true}]}
            />
        </DrawerForm>
    );
};

export default AddOrEdit