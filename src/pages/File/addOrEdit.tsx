import {
    DrawerForm,
    ProFormText,
} from '@ant-design/pro-components';
import {Form, Upload, Button} from 'antd';
import {useEffect} from "react";
import {useRequest} from "@umijs/max";
import {CommonType} from "@/types/common.typings";
import {UploadChangeParam} from "antd/lib/upload/interface";
import {UploadOutlined} from '@ant-design/icons';

const AddOrEdit: React.FC<CommonType.IProps> = ({setDrawerVisible, id, actionRef}) => {
    const [form] = Form.useForm();

    const {loading, run: queryRun} = useRequest(`/file/${id}`,
        {
            manual: true,
            onSuccess: (res) => {
                form.setFieldsValue(res)
            }
        });

    const {loading: saveLoading, run: saveRun} = useRequest(
        (data: File.FileItem) => {
            if (id) {
                return {
                    method: 'PATCH',
                    url: `/file/${id}`,
                    data,
                }
            }
            return {
                method: 'POST',
                url: `/file`,
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

    const beforeUpload = (file: UploadChangeParam) => {
        console.log('onChange', info);
        if (info.file.status === 'done') {
            // 文件上传成功
            console.log(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            // 文件上传失败
            console.error(`${info.file.name} file upload failed.`);
        }
    };


    return (
        <DrawerForm<File.FileItem>
            loading={loading || saveLoading}
            onOpenChange={setDrawerVisible}
            open={true}
            title={id ? '编辑文件' : '上传文件'}
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
                name="description"
                width="md"
                label="描述"
                placeholder="请输入描述"
            />
            <Form.Item name="files" label="Dragger">
                <Upload
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    accept=".png, .jpg, .jpeg"
                >
                    <Button icon={<UploadOutlined/>}>点击或拖拽文件到这里进行上传</Button>
                </Upload>
            </Form.Item>
        </DrawerForm>
    );
};

export default AddOrEdit