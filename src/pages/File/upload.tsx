import React, {useEffect, useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {Button, Form, message, Upload, Spin} from 'antd';
import {useRequest} from "@umijs/max";

interface OSSUploadProps {
    label: string
    type: string
    formName: string
    url?: string;
    onChange: (url: string) => void;
}

const OSSUpload = ({url, label, formName, type, onChange}: OSSUploadProps) => {
    const [loading, setLoading] = useState(false);
    const {loading: ossConfigLoading, run: signatureRun, data: ossConfig} = useRequest(`/file/signature`,
        {
            manual: true,
        });

    useEffect(() => {
        signatureRun()
    }, [])


    const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
        if (!ossConfig) return false;

        if (new Date(ossConfig.expire) < new Date()) {
            message.error('阿里云token已过期')
            return false
        }
        const maxSize = 2 * 1024 * 1024

        if (file.size > maxSize) {
            message.error('文件大小超过限制（最大2MB）');
            return false;
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            message.error('文件类型不支持');
            return false;
        }
        return true;
    };
    const customRequest: any = async ({file}: { file: File }) => {
        setLoading(true)
        try {
            const suffix = file.name.slice(file.name.lastIndexOf('.'));
            const key = `${ossConfig.dir}/${type}/${Date.now() + suffix}`;
            const formData = new FormData();
            formData.append('key', key);
            formData.append('OSSAccessKeyId', ossConfig.accessId);
            formData.append('policy', ossConfig.policy);
            formData.append('signature', ossConfig.signature);
            formData.append('file', file);

            const response = await fetch(ossConfig.host, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                onChange(key)
            } else {
                const error = await response.text();
                message.error(error);
            }
            setLoading(false)
        } catch (error: any) {
            message.error(error.message || '上传失败');
            setLoading(false)
        }
    };
    const uploadProps: UploadProps = {
        customRequest,
        beforeUpload,
        fileList: [],
        accept: '.png, .jpg, .jpeg, .gif'
    };

    return (
        <Form.Item label={label} name={formName} rules={[{required: true}]}>
            <Spin spinning={ossConfigLoading || loading}>
                <Upload {...uploadProps}>
                    {
                        url ? <img src={ url} alt="" style={{height: '70px'}}/> :
                            <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                    }
                </Upload>
            </Spin>
        </Form.Item>
    );
};
export default OSSUpload;