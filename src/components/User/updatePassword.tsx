import React from "react";
import {
    ModalForm,
    ProFormText,
} from '@ant-design/pro-components';
import {Form} from "antd";
import {useRequest} from "@umijs/max";

interface IForm {
    oldPassword: string
    password: string
    confirmPassword: string
}

interface IProps {
    setDrawerVisible: (visible: boolean) => void
    logout: () => void
    id: string
}

const UpdatePassword: React.FC<IProps> = ({setDrawerVisible, logout, id}) => {
    const [form] = Form.useForm();
    const {loading, run} = useRequest(
        (data: IForm) => {
            return {
                method: 'POST',
                url: `/user/updatePassword`,
                data: {
                    password: data.password,
                    oldPassword: data.oldPassword,
                    id
                },
            }
        },
        {
            manual: true,
            onSuccess: () => {
                setDrawerVisible(false)
                logout()
            }
        });
    return <ModalForm
        width={400}
        loading={loading}
        form={form}
        title="修改密码"
        open={true}
        onOpenChange={setDrawerVisible}
        onFinish={async (values) => {
            run(values)
        }}
    >
        <ProFormText.Password
            name="oldPassword"
            label="旧密码"
            rules={[{required: true, message: '请输入旧密码'}]}
        />
        <ProFormText.Password
            name="password"
            label="新密码"
            rules={[{required: true, message: '请输入新密码'}]}
        />
        <ProFormText.Password
            name="confirmPassword"
            label="确认新密码"
            rules={[
                {required: true, message: '请确认新密码'},
                ({getFieldValue}) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                }),
            ]}
        />
    </ModalForm>
}

export default UpdatePassword