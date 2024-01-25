import React, {useEffect, forwardRef, useRef, useState} from "react";
// @ts-ignore
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import Upload from "@/pages/File/addOrEdit";

const MarkdownEditors = forwardRef(function MarkdownEditor({setEditor, editor}: any) {
    const editorRef = useRef(null)

    const [uploadDrawer, setUploadDrawer] = useState(false)

    function uploadButton() {
        const button = document.createElement('button');
        button.className = 'image toastui-editor-toolbar-icons';
        button.style.margin = '0';
        button.addEventListener('click', () => {
            setUploadDrawer(true)
        });
        return button;
    }

    useEffect(() => {
        const editor = new Editor({
            el: editorRef.current,
            previewStyle: 'vertical',
            height: '500px',
            initialValue: '',
            placeholder: 'Have a nice day!',
            toolbarItems: [
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task', 'indent', 'outdent'],
                ['table', 'link', {
                    el: uploadButton(),
                    command: 'bold',
                    tooltip: 'Insert Image'
                }],
                ['code', 'codeblock'],
            ]
        });
        setEditor(editor)

        return () => {
            editor.destroy()
        }
    }, [])

    const onChange = (data: File.FileItem) => {
        editor.insertText(`![${data?.description || '404'}](${data.url})`)
    }

    return (
        <>
            {uploadDrawer && <Upload setDrawerVisible={setUploadDrawer} id={''} onChange={onChange} type={'article'}/>}
            <div id="editor" ref={editorRef}/>
        </>
    )
})

export default MarkdownEditors
