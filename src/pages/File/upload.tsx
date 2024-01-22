import React, {useEffect, useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {  UploadProps} from 'antd';
import {Button, Form, Upload} from 'antd';
import {useRequest} from "@umijs/max";

interface OSSUploadProps {
    label: string
    type: string
    formName: string
    url?: string;
    onChange?: (url: string) => void;
}

const OSSUpload = ({url, label, formName, type}: OSSUploadProps) => {
    const {run: signatureRun, data: ossConfig} = useRequest(`/file/signature`,
        {
            manual: true,
        });

    useEffect(() => {
        signatureRun()
    }, [])


    const getExtraData: UploadProps['data'] = (file) => ({
        key: file.url,
        OSSAccessKeyId: ossConfig?.accessId,
        policy: ossConfig?.policy,
        Signature: ossConfig?.signature,
    });

    const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
        if (!ossConfig) return false;

        if (new Date(ossConfig.expire) < new Date()) {
            await signatureRun();
        }
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        // @ts-ignore
        file.url = `${ossConfig.dir}/${type}/${Date.now() + suffix}`;
        return file;
    };

    const uploadProps: UploadProps = {
        name: 'file',
        action: ossConfig?.host,
        data: getExtraData,
        beforeUpload,
        fileList: []
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