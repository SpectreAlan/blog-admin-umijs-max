import {
    DrawerForm,
    ProFormText,
} from '@ant-design/pro-components';
import {Form, Upload, Button} from 'antd';
import {useEffect} from "react";
import {useRequest} from "@umijs/max";
import {CommonType} from "@/types/common.typings";
import {UploadOutlined} from '@ant-design/icons';

const AddOrEdit: React.FC<CommonType.IProps> = ({setDrawerVisible, id, actionRef}) => {
    const [form] = Form.useForm();

    const {loading, run: signatureRun, data:config} = useRequest(`/file/signature`,
        {
            manual: true,
        });

    useEffect(()=>{
        signatureRun()
    }, [])

    const {loading: saveLoading, run: uploadToOss} = useRequest(
        (data: FormData) => {
            return {
                method: 'POST',
                url: config.host,
                data,
            }

        },
        {
            manual: true,
            onSuccess: (res) => {
                console.log(res);
            }
        });


    const beforeUpload = (file: any) => {
        console.log(config);
        console.log(file);
        const formData = new FormData()
        const key = `${config.dir}/common/${new Date().getTime()}.${
            file.name.split('/')[1]
        }`
        formData.append('key', key)
        formData.append('OSSAccessKeyId', config.accessId)
        formData.append('policy', config.policy)
        formData.append('signature', config.signature)
        formData.append('success_action_status', '200')
        formData.append('file', file)
        uploadToOss(formData)
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
                    action='/file'
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