import {PlusOutlined} from '@ant-design/icons';
import {
    DrawerForm,
    ProFormText,
} from '@ant-design/pro-components';
import {Button, Form } from 'antd';
import {useState} from "react";

export default () => {
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [form] = Form.useForm<{ name: string; company: string }>();

    return (
        <DrawerForm<{
            name: string;
            company: string;
        }>
            onOpenChange={setDrawerVisible}
            open={drawerVisible}
            title="新建一言"
            resize={{
                onResize() {
                    console.log('resize!');
                },
                maxWidth: window.innerWidth * 0.8,
                minWidth: 300,
            }}
            form={form}
            trigger={
                <Button type="primary" onClick={() => setDrawerVisible(true)}>
                    <PlusOutlined/>
                    新建一言
                </Button>
            }
            autoFocusFirstInput
            drawerProps={{
                destroyOnClose: true,
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
                setDrawerVisible(false)
            }}
        >
            <ProFormText
                name="content"
                width="md"
                label="内容"
                placeholder="请输入内容"
            />
            <ProFormText
                name="author"
                width="md"
                label="来源"
                placeholder="请输入来源"
            />
            <ProFormText
                name="type"
                width="md"
                label="类型"
                placeholder="请输入类型"
            />
        </DrawerForm>
    );
};