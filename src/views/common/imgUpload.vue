<template>
  <el-form-item :label="label" prop="icon">
    <span class="tipsRed">(注意：上传的图片大小必须小于1M，支持png、jpg、jpeg、gif格式)</span>
    <div v-if="loading" class="upload-loading"><i class="el-icon-loading" />上传中....</div>
    <el-upload
      v-if="!loading"
      ref="upload"
      class="avatar-uploader"
      :action="url"
      :show-file-list="false"
      :on-success="success"
      :on-change="upload"
      :on-error="error"
      :file-list="fileList"
      :auto-upload="false"
      name="mFile"
    >
      <div>
        <img v-if="icon" :src="icon" class="avatar" alt="">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </div>
    </el-upload>
    <!--    <el-form-item prop="img">-->
    <!--      <el-input v-model.trim="icon" size="small" disabled style="width: 80%;" />-->
    <!--    </el-form-item>-->
  </el-form-item>
</template>

<script>
export default {
  name: 'ImgUpload',
  props: {
    label: {
      type: String,
      default() {
        return ''
      }
    },
    icon: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      loading: false,
      fileList: [],
      url: process.env.VUE_APP_BASE_API + '/file/uploadImg.do'
    }
  },
  methods: {
    success(res) {
      this.loading = false
      if (res.code) {
        this.$emit('setIcon', res.data.host + res.data.filePath)
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      } else {
        this.$message.error(res.msg || '上传失败')
      }
    },
    upload(file) {
      if (!this.$refs.upload) { return }
      if (!(file.raw.type === 'image/png' || file.raw.type === 'image/jpg' || file.raw.type === 'image/jpeg' || file.raw.type === 'image/gif')) {
        this.fileList = []
        this.$notify.warning({
          title: '格式错误',
          message: '图片格式只能是png、jpg、jpeg、gif，请重新选择'
        })
        return
      }
      const size = file.raw.size / 1024 / 1024 / 2
      if (size > 1) {
        this.fileList = []
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于1M，请重新选择'
        })
        return
      }
      this.loading = true
      this.$refs.upload.submit()
    },
    error() {
      this.fileList = []
      this.loading = false
      this.$message({
        type: 'error',
        message: '上传失败，请稍后重试'
      })
    }

  }
}
</script>

<style scoped>

</style>
