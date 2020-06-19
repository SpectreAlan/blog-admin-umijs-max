<template>
  <div>
    <div v-if="loading" class="upload-loading"><i class="el-icon-loading" />上传中....</div>
    <el-upload
      v-if="!loading"
      ref="upload"
      class="img-uploader"
      :action="url"
      :show-file-list="false"
      :on-success="success"
      :on-change="upload"
      :on-error="error"
      :file-list="fileList"
      :auto-upload="false"
      name="file"
    >
      <img v-if="img" :src="getUrl(img)" class="img" alt="" :style="{width: width, height: height}">
      <i v-else class="el-icon-plus img-uploader-icon" :style="{width: width, height: height, lineHeight: height}" />
    </el-upload>
  </div>
</template>

<script>
import defaultSetting from '@/settings'
import { getUrl } from '@/utils/common'
export default {
  name: 'ImgUpload',
  props: {
    label: {
      type: String,
      default() {
        return ''
      }
    },
    img: {
      type: String,
      default() {
        return ''
      }
    },
    width: {
      type: String,
      default() {
        return '178px'
      }
    },
    height: {
      type: String,
      default() {
        return '178px'
      }
    }
  },
  data() {
    return {
      loading: false,
      fileList: [],
      url: defaultSetting.proxy.name + '/upload/images'
    }
  },
  methods: {
    getUrl,
    success(res) {
      this.loading = false
      if (res.code) {
        this.$emit('setImg', res.data)
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

<style scoped lang="scss">
.img-uploader{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
  }
  .img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
  .img {
    display: block;
  }
}
</style>
