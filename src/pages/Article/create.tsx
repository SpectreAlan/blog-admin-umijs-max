import {
    DrawerForm,
    ProFormText,
    ProForm,
    ProFormSelect,
    ProFormTextArea
} from '@ant-design/pro-components';
import {Form, Button} from 'antd';
import {useEffect, useState} from "react";
import {useRequest} from "@umijs/max";
import {CommonType} from "@/types/common.typings";
import MarkdownEditors from '@/pages/Article/markdown'
import Editor from "@toast-ui/editor";
import OSSUpload from '@/pages/File/upload'
import {CloudUploadOutlined, CloudServerOutlined}  from '@ant-design/icons'

const Create: React.FC<CommonType.IProps> = ({setDrawerVisible, id, actionRef}) => {
    const [editor, setEditor] = useState(null | Editor)
    const [form] = Form.useForm();
    const [tags, setTags] = useState([])
    const [category, setCategory] = useState([])

    const {loading, run: queryRun} = useRequest(`/article/${id}`,
        {
            manual: true,
            onSuccess: (res) => {
                form.setFieldsValue(res)
            }
        });

    const {run: queryTags} = useRequest(() => {
        return {
            method: 'GET',
            url: '/tag',
            params: {current: 1, pageSize: 50},
        }
    }, {
        manual: true,
        onSuccess: ({list}) => {
            setTags(list?.map(({title, id}) => ({label: title, value: id})))
        }
    });
    const {run: queryCategory} = useRequest(() => {
        return {
            method: 'GET',
            url: '/category',
            params: {current: 1, pageSize: 50},
        }
    }, {
        manual: true,
        onSuccess: ({list}) => {
            setCategory(list?.map(({title, id}) => ({label: title, value: id})))
        }
    });

    const {loading: saveLoading, run: saveRun} = useRequest(
        (status: number) => {
            if (id) {
                return {
                    method: 'PATCH',
                    url: `/article/${id}`,
                    data,
                }
            }
            return {
                method: 'POST',
                url: `/article`,
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
        queryTags()
        queryCategory()
        if (id) {
            queryRun()
        }
    }, [])

    return (
        <DrawerForm<Article.Form>
            width='100%'
            loading={loading || saveLoading}
            onOpenChange={setDrawerVisible}
            open={true}
            title={id ? '编辑文章' : '新建文章'}
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
            submitter={{
                render: () => {
                    return [
                        <Button
                            key="ok"
                            onClick={() => setDrawerVisible(false)}
                        >
                            取消
                        </Button>,
                        <Button
                            icon={<CloudServerOutlined/>}
                            type='primary'
                            shape="round"
                            key="save"
                            onClick={() => saveRun(0)}
                        >
                            保存为草稿
                        </Button>,
                        <Button
                            icon={<CloudUploadOutlined />}
                            type='primary'
                            key="publish"
                            onClick={() => saveRun(a)}
                        >
                            发布
                        </Button>,
                    ];
                },
            }}
            onFinish={async (values) => {
                console.log(values);
                console.log(1);
                console.log(editor.getMarkdown());
                // saveRun(values)
            }}
        >
            <ProForm.Group>
                <ProFormText
                    name="title"
                    width="md"
                    label="名称"
                    placeholder="请输入名称"
                />
                <ProFormSelect
                    width="md"
                    name="category"
                    label="分类"
                    options={category}
                    placeholder="请选择分类"
                    showSearch
                />
                <ProFormSelect
                    width="md"
                    name="tags"
                    label="标签"
                    options={tags}
                    placeholder="请选择标签"
                    mode="multiple"
                    showSearch
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormTextArea
                    name="description"
                    width="md"
                    label="描述"
                    placeholder="请输入描述"
                />
                <ProFormTextArea
                    name="keywords"
                    width="md"
                    label="关键字"
                    placeholder="请输入关键字"
                />
                <OSSUpload formName='cover' label='封面'
                           url={'https://cdn.helingqi.com/wavatar/763962c5359409dc7115d2819b9649a7?d=mm'}/>
            </ProForm.Group>
            <Form.Item label='内容' name='content'>
                <MarkdownEditors setEditor={setEditor}/>
            </Form.Item>
        </DrawerForm>
    );
};

export default Create