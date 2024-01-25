import {
    DrawerForm,
    ProFormText,
} from '@ant-design/pro-components';
import {useState} from 'react'
import {Form} from 'antd';
import {CommonType} from "@/types/common.typings";
import OSSUpload from '@/pages/File/upload'
import {useRequest} from "@@/exports";

const AddOrEdit: React.FC<CommonType.IProps> = ({setDrawerVisible, onChange, actionRef}) => {
    const [form] = Form.useForm();

    const [url, setUrl] = useState('');

    const {loading, run} = useRequest(
        (data: File.FileItem) => {
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
                onChange?.({url, description: form.getFieldValue('description')})
                actionRef?.current?.reloadAndRest?.();
            }
        });

    return (
        <DrawerForm<File.FileItem>
            width={300}
            onOpenChange={setDrawerVisible}
            open={true}
            title='上传图片'
            form={form}
            loading={loading}
            drawerProps={{
                destroyOnClose: true,
                footer: null
            }}
            submitter={{
                render: false,
            }}
        >
            <ProFormText
                name="description"
                width="md"
                label="描述"
                placeholder="请输入描述"
            />
            <OSSUpload label={'选择文件'} formName='file' url={url} type='common' onChange={(url: string) => {
                setUrl(url)
                run({url, description: form.getFieldValue('description')})
            }}/>
        </DrawerForm>
    );
};

export default AddOrEdit