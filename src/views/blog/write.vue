<template>
  <div class="write">
    <el-form ref="form" :inline="true" :model="form" label-width="120px" :rules="rules" size="medium">
      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="form.title" style="width: 400px;" clearable />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%" clearable>
          <el-option
            v-for="(item,k) in category"
            :key="k"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="form.tags" multiple placeholder="请选择标签" style="width: 400px;" clearable>
          <el-option
            v-for="(item,k) in tags"
            :key="k"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="概述" prop="des">
        <el-input
          v-model.trim="form.des"
          :rows="4"
          type="textarea"
          maxlength="150"
          show-word-limit
          clearable
          style="width: 400px;"
        />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-radio v-model="urlType" :label="0">手动输入</el-radio>
        <el-radio v-model="urlType" :label="1">上传</el-radio>
        <br>
        <ImgUpLoad v-if="urlType" :img="form.cover" :title="form.title" @setImg="setImg" />
        <el-input v-else v-model.trim="form.cover" style="width: 200px;" clearable placeholder="图片路径..." />
      </el-form-item>
      <el-form-item label="关键字" prop="keywords">
        <el-input
          v-model.trim="form.keywords"
          :rows="4"
          type="textarea"
          maxlength="64"
          show-word-limit
          style="width: 400px;height:100px"
          clearable
        />
      </el-form-item>
      <el-form-item label="文章目录">
        <el-switch
          v-model="form.tic"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="success" size="medium " @click="onSubmit(1)"><i class="el-icon-upload el-icon--right" />立即发布</el-button>
        <el-button type="primary" size="medium " icon="el-icon-edit" @click="onSubmit(0)">保存草稿</el-button>
      </el-form-item>
    </el-form>
    <Markdown ref="markdown" :content="form.content" />
  </div>
</template>

<script>
import Markdown from '@/components/Markdown/'
import { tags, category, detail, add, edit } from '@/api/write'
import ImgUpLoad from '@/views/common/imgUpload'
export default {
  name: 'Write',
  components: { Markdown, ImgUpLoad },
  data() {
    return {
      tags: [],
      rules: {},
      category: [],
      urlType: 1,
      form: {
        content: '',
        title: '',
        des: '',
        category: '',
        tags: [],
        keywords: '',
        cover: '',
        tic: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    setImg(url) {
      this.form.cover = url
    },
    getMarkdown(content) {
      this.form.content = content
    },
    onSubmit(status) {
      this.form.status = status
      this.form.content = this.$refs.markdown.getMarkdown()
      const msg = status ? '保存成功' : '发布成功'
      this.form.id ? edit(this.form).then(res => {
        this.$message.success(msg)
      })
        : add(this.form).then(res => {
          this.$message.success(msg)
        })
    },
    search(id) {
      if (!id) {
        return
      }
      detail({ id }).then(res => {
        const buffer = new Buffer(res.content)
        res.content = buffer.toString()
        this.form = res
      })
    },
    getList() {
      category().then(res => {
        this.category = res
      })
      tags().then(res => {
        this.tags = res
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.search(vm.$route.query.id)
    })
  }
}
</script>
<style scoped lang="scss">
.write{
  padding-top: 10px;
}

</style>

