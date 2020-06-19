<template>
  <Editor
    ref="editor"
    :options="config"
    height="650px"
    preview-style="vertical"
  />
</template>

<script>
import { Editor } from '@toast-ui/vue-editor'
import config from './config'
export default {
  name: 'Markdown',
  components: { Editor },
  props: {
    content: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      config: config
    }
  },
  watch: {
    content() {
      this.setMarkdown()
    }
  },
  methods: {
    getMarkdown() {
      return this.$refs.editor.invoke('getMarkdown')
    },
    setMarkdown() {
      this.$refs.editor.invoke('setMarkdown', this.content)
    }
  }
}
</script>
<style scoped>
</style>

