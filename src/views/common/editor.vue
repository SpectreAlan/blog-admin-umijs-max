<template>
  <div class="edit">
    <el-upload
      ref="upload"
      :show-file-list="false"
      :on-success="success"
      :on-change="upload"
      :on-error="error"
      :file-list="fileList"
      :auto-upload="false"
      name="mFile"
      multiple
      :action="url"
      class="uploadImage"
    >
      <el-button id="btn" size="small" type="primary">点击上传</el-button>
    </el-upload>
    <quill-editor
      ref="QuillEditor"
      v-model="content"
      :options="editorOption"
    />
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { upload, error } from '@/utils/upload'
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['image'],
  ['clean']
]
const titleConfig = {
  'ql-bold': '加粗',
  'ql-color': '字体颜色',
  'ql-font': '字体',
  'ql-code': '插入代码',
  'ql-italic': '斜体',
  'ql-background': '颜色',
  'ql-size': '字体大小',
  'ql-strike': '删除线',
  'ql-script': '上标/下标',
  'ql-underline': '下划线',
  'ql-blockquote': '引用',
  'ql-header': '标题',
  'ql-indent': '缩进',
  'ql-list': '列表',
  'ql-align': '文本对齐',
  'ql-direction': '文本方向',
  'ql-code-block': '代码块',
  'ql-image': '图片',
  'ql-clean': '清除字体样式'
}
export default {
  name: 'QuillEditor',
  components: {
    quillEditor
  },
  data() {
    return {
      fileList: [],
      url: '',
      content: '',
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': value => {
                if (value) {
                  document.getElementById('btn').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    this.addQuillTitle()
    this.url = process.env.VUE_APP_BASE_API + '/announce/doUpload'
  },
  methods: {
    upload,
    error,
    addQuillTitle() {
      const oToolBar = document.querySelector('.ql-toolbar')
      const aButton = oToolBar.querySelectorAll('button')
      const aSelect = oToolBar.querySelectorAll('select')
      aButton.forEach(function(item) {
        if (item.className === 'ql-script') {
          item.value === 'sub' ? item.title = '下标' : item.title = '上标'
        } else if (item.className === 'ql-indent') {
          item.value === '+1' ? item.title = '向右缩进' : item.title = '向左缩进'
        } else {
          item.title = titleConfig[item.classList[0]]
        }
      })
      aSelect.forEach(function(item) {
        item.parentNode.title = titleConfig[item.classList[0]]
      })
    },
    success(res) {
      const quill = this.$refs.QuillEditor.quill
      if (res.code === 1) {
        const length = quill.getSelection().index
        quill.insertEmbed(length, 'image', res.data.filePath)
        quill.setSelection(length + 1)
      } else {
        this.$message.error(res.msg || '图片插入失败')
      }
    }
  }
}
</script>

<style scoped>
#btn{
  display: none;
}
.richTextStyle img {
    max-width: 400px;
    margin:10px;
  }
  /*富文本文字溢出不换行样式 */
  .richTextStyle p, .richTextStyle sup, .richTextStyle strong,
  .richTextStyle em, .richTextStyle u,
  .richTextStyle s, .richTextStyle blockquote,
  .richTextStyle h1, .richTextStyle h2, .richTextStyle h3,
  .richTextStyle h4, .richTextStyle h5, .richTextStyle h6,
  .richTextStyle li, .richTextStyle sub, .richTextStyle a {
    word-break: break-all;
  }
</style>
