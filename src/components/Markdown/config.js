import '@toast-ui/editor/dist/toastui-editor.css'
import 'codemirror/lib/codemirror.css'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import hljs from 'highlight.js'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import uml from '@toast-ui/editor-plugin-uml'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
import chart from '@toast-ui/editor-plugin-chart'
import '@toast-ui/editor/dist/i18n/zh-cn'

import 'tui-chart/dist/tui-chart.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import 'highlight.js/styles/github.css'

export default {
  minHeight: '600px',
  language: 'zh-CN',
  useCommandShortcut: true,
  useDefaultHTMLSanitizer: true,
  usageStatistics: true,
  hideModeSwitch: false,
  placeholder: '让时间美好与你环环相扣......',
  plugins: [codeSyntaxHighlight, colorSyntax, uml, tableMergedCell, chart, { hljs }],
  toolbarItems: [
    'heading',
    'bold',
    'italic',
    'strike',
    'divider',
    'hr',
    'quote',
    'divider',
    'ul',
    'ol',
    'task',
    'indent',
    'outdent',
    'divider',
    'table',
    'image',
    'link',
    'divider',
    'code',
    'codeblock'
  ]
}
