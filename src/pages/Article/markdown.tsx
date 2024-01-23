import React, {useEffect, forwardRef, useRef} from "react";
// @ts-ignore
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

const MarkdownEditors = forwardRef(function MarkdownEditor({ setEditor }: any) {
    const editorRef = useRef(null)
    useEffect(() => {
        const editor = new Editor({
            el: editorRef.current,
            previewStyle: 'vertical',
            height: '500px',
            initialValue: '',
            placeholder: 'Have a nice day!'
        });
        setEditor(editor)

        return () => {
            editor.destroy()
        }
    }, [])

    return (
        <div id="editor" ref={editorRef} />
    )
})

export default MarkdownEditors
