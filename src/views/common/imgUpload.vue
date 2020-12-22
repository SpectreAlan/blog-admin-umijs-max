<template>
  <div class="img-uploader" @click="choose">
    <div v-if="loading" class="upload-loading"><i class="el-icon-loading" />上传中....</div>
    <input ref="file" type="file" class="file" @change="upload($event)">
    <img v-if="img" :src="img">
    <el-button v-if="img" type="primary" class="previewBtn" @click.stop="previewDialog = true">预览</el-button>
    <i v-if="!img && !loading" class="el-icon-plus img-uploader-icon" />
    <el-dialog
      v-if="previewDialog"
      title="预览"
      :close-on-click-modal="true"
      :visible.sync="previewDialog"
      center
      append-to-body
    >
      选择预览背景颜色: <el-color-picker v-model="imgPreviewBg" size="medium" show-alpha />
      <div class="imgPreview" :style="{background: imgPreviewBg}">
        <img :src="img">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { upload } from '@/api/images'
import { photoCompress, base64ToBlob } from './tools'
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
    title: {
      type: String,
      default() {
        return ''
      }
    },
    path: {
      type: String,
      default() {
        return '/blog/common/'
      }
    },
    storage: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      loading: false,
      imgPreviewBg: '#fff',
      previewDialog: false,
      fileList: [],
      url: ''
    }
  },
  methods: {
    choose() {
      this.$refs.file.click()
    },
    upload(e) {
      const file = e.target.files[0]
      if (!/png|jpg|jpeg|bmp|gif/.test(file.type)) {
        this.$message.error('图片格式错误,仅支持png、jpg、jpeg、bmp、gif')
        return
      }
      if (file.type.includes('gif')) {
        this.uploadReq(file)
        return
      }
      photoCompress(e.target.files[0], { quality: 0.7, type: file.type }, (base64) => {
        const blob = base64ToBlob(base64)
        this.uploadReq(file, blob)
      })
    },
    uploadReq(file, blob) {
      this.loading = true
      const params = new FormData()
      params.append('file', blob || file, file.name)
      params.append('image_title', this.title)
      params.append('path', this.path)
      params.append('storage', this.storage)
      upload(params).then(res => {
        this.loading = false
        this.$emit('setImg', res)
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style scoped lang="scss">
  .img-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 100px;

    .upload-loading,.el-icon-plus {
      text-align: center;
      position: absolute;
      line-height: 33px;
      top: 50%;
      left: 50%;
      color: #8c939d;
      transform: translate(-50%, -50%);
    }
    i{
      font-size: 28px;
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
    .previewBtn{
      position: absolute;
      top: 0;
      right: 0;
      z-index: 9999999999;
    }
    .file {
      display: none;
    }
  }
  .imgPreview {
    text-align: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
