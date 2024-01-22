import React, {useEffect} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {  UploadProps} from 'antd';
import {Button, Form, Upload} from 'antd';
import {useRequest} from "@umijs/max";

interface OSSUploadProps {
    label: string
    formName: string
    url?: string;
    onChange?: (url: string) => void;
}

const OSSUpload = ({url, label, formName}: OSSUploadProps) => {
    const {run: signatureRun, data: OSSData} = useRequest(`/file/signature`,
        {
            manual: true,
        });

    useEffect(() => {
        signatureRun()
    }, [])


    const getExtraData: UploadProps['data'] = (file) => ({
        key: file.url,
        OSSAccessKeyId: OSSData?.accessId,
        policy: OSSData?.policy,
        Signature: OSSData?.signature,
    });

    const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
        if (!OSSData) return false;

        const expire = Number(OSSData.expire) * 1000;

        if (expire < Date.now()) {
            await init();
        }

        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        // @ts-ignore
        file.url = OSSData.dir + filename;

        return file;
    };

    const uploadProps: UploadProps = {
        name: 'file',
        action: OSSData?.host,
        data: getExtraData,
        beforeUpload,
    };

    return (
        <Form.Item label={label} name={formName} rules={[{required: true}]}>
            <Upload {...uploadProps}>
                {
                    url ?  <img src={url} alt=""/> : <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                }
            </Upload>
        </Form.Item>
    );
};
export default OSSUpload;