<template>
  <div class="img-uploader" @click="choose">
    <div v-if="loading" class="upload-loading"><i class="el-icon-loading" />上传中....</div>
    <input ref="file" type="file" class="file" @change="upload($event)">
    <img v-if="img" :src="img">
    <i v-else class="el-icon-plus img-uploader-icon" />
  </div>
</template>

<script>
import defaultSetting from '@/settings'
import axios from 'axios'
import imgzip from 'imgzip'
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
      imgzip.photoCompress(e.target.files[0], {}, (base64) => {
        const blob = imgzip.convertBase64UrlToBlob(base64)
        const formData = new FormData()
        formData.append('file', blob)
        this.loading = true
        axios({
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          method: 'post',
          url: defaultSetting.proxy.name + '/uploads/images',
          data: formData
        }).then(res => {
          if (res.status === 200) {
            this.loading = false
            if (res.data.code) {
              this.$message.success('上传成功')
              this.$emit('setImg', res.data.data)
            } else {
              this.$message.error('上传失败')
            }
          }
        })
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
