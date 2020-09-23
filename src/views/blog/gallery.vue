<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.title" placeholder="名称" style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search">查询</el-button>
      <el-button type="primary" class="filter-item" @click="addImage">添加</el-button>
    </div>
    <table-template
      :table-header="tableHeader"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @recovery="recovery"
      @handleEdit="handleEdit"
      @handleStatus="handleStatus"
      @handleDel="handleDel"
    />
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="alterVisible" width="600px">
      <el-form ref="form" :model="form" label-width="100px" size="mini" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="form.title" />
        </el-form-item>
        <el-form-item label="图片" prop="url">
          <ImgUpLoad :img="form.url" :title="form.title" storage="1" @setImg="setIcon" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.origin_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input
            v-model.trim="form.des"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="reqLoading" size="medium " @click="onSubmit">立即提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-pagination :current-page.sync="listQuery.page" layout="total, prev,pager, next" :total="total" background @current-change="search" />
  </div>
</template>

<script>
import ImgUpLoad from '@/views/common/imgUpload'
import { list, edit, del, add } from '@/api/gallery'
import { recovery } from '@/utils/common'
import TableTemplate from '../common/table'
export default {
  name: 'Gallery',
  components: { TableTemplate, ImgUpLoad },
  data() {
    return {
      rules: { title: [{ required: true, trigger: 'blur', message: '请输入标题' }], des: [{ required: true, message: '请输入描述', trigger: 'blur' }] },
      list: [],
      title: '',
      articleData: [],
      total: 0,
      loading: true,
      reqLoading: false,
      form: { title: '', des: '', origin_time: '', url: '', status: 1, remark: '' },
      alterVisible: false,
      listQuery: { page: 1, title: '' },
      tableHeader: [
        { field: 'title', sortable: 'custom', title: '标题' },
        { field: 'des', sortable: 'custom', title: '描述' },
        { field: 'origin_time', sortable: 'custom', title: '时间' },
        { field: 'url', sortable: 'custom', title: '预览', img: 'url' },
        { field: 'status', title: '状态', switch: 'handleStatus', inactive: 0, active: 1 },
        { field: 'update_time', title: '更新时间' },
        { field: 'remark', title: '备注' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '编辑', field: 'handleEdit', type: 'primary' }, { title: '删除', field: 'handleDel', type: 'danger' }]
    }
  },
  watch: {
    alterVisible() {
      if (!this.alterVisible) {
        this.search()
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    recovery,
    setIcon(url) {
      this.form.url = url
    },
    search() {
      this.loading = true
      list(this.listQuery).then(res => {
        this.loading = false
        this.list = res.list
        this.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.title !== '添加' ? this.editReq() : this.addReq()
        }
      })
    },
    addImage() {
      this.title = '添加'
      this.alterVisible = true
      this.form = { ...{}, ...this.$options.data().form }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    addReq() {
      add(this.form).then(() => {
        this.form.des = ''
        this.form.url = ''
        this.form.remark = ''
      })
    },
    editReq() {
      edit(this.form).then(() => {
        this.alterVisible = false
      })
    },
    handleEdit(data) {
      this.title = '编辑'
      this.alterVisible = true
      this.form = { ...data }
    },
    handleStatus(data) {
      this.loading = true
      edit({ id: data.id, status: data.status }).then(() => {
        this.loading = false
      }).catch(() => {
        this.search()
      })
    },
    handleDel(data) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        del({ id: data.id, url: data.url }).then(() => {
          this.search()
        })
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>
</style>
