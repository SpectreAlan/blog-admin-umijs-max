import {
    DrawerForm,
    ProFormText,
} from '@ant-design/pro-components';
import {Form} from 'antd';
import {CommonType} from "@/types/common.typings";
import OSSUpload from '@/pages/File/upload'

const AddOrEdit: React.FC<CommonType.IProps> = ({setDrawerVisible}) => {
    const [form] = Form.useForm();

    return (
        <DrawerForm<File.FileItem>
            onOpenChange={setDrawerVisible}
            open={true}
            title='上传文件'
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
                console.log(values);
            }}
        >
            <ProFormText
                name="description"
                width="md"
                label="描述"
                placeholder="请输入描述"
            />
            <OSSUpload label={'文件上传'} formName='file' url=''/>
        </DrawerForm>
    );
};

export default AddOrEdit