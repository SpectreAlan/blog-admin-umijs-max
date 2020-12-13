<template>
  <div class="img-uploader" @click="choose">
    <div v-if="loading" class="upload-loading"><i class="el-icon-loading" />上传中....</div>
    <input ref="file" type="file" class="file" @change="upload($event)">
    <img v-if="img" :src="img">
    <i v-if="!img && !loading" class="el-icon-plus img-uploader-icon" />
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
      photoCompress(e.target.files[0], { quality: 0.7, type: file.type }, (base64) => {
        const blob = base64ToBlob(base64)
        this.loading = true
        const params = new FormData()
        params.append('file', blob, file.name)
        params.append('image_title', this.title)
        params.append('storage', this.storage)
        console.log(params.get('file'))
        upload(params).then(res => {
          this.loading = false
          this.$emit('setImg', res)
        }).catch(() => { this.loading = false })
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
    min-height:100px;
    .img-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      text-align: center;
      position: absolute;
      top: 50%;
      left:50%;
      transform: translate(-50%,-50%);
    }
    img {
      position:absolute;
      width:100%;
      height:100%;
    }
    .file{
      display: none;
    }
  }
</style>
