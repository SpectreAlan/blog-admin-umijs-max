<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.title" placeholder="图片名称" style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search">查询</el-button>
      <el-button type="primary" class="filter-item" @click="add">添加</el-button>
    </div>
    <table-template
      :table-header="tableHeader"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @recovery="recovery"
      @handleDel="handleDel"
    />
    <el-dialog :close-on-click-modal="false" title="添加图片" :visible.sync="alterVisible" width="20%">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-form-item label="图片名称" prop="account">
          <el-input v-model.trim="form.title" clearable />
        </el-form-item>
        <el-form-item label="图片" prop="avatar">
          <ImgUpLoad :img="form.url" :title="form.title" height="100px" width="100px" @setImg="setIcon" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-pagination :current-page.sync="listQuery.page" layout="total, prev,pager, next" :total="total" background @current-change="search" />
  </div>
</template>

<script>
import { del, search } from '@/api/images'
import { recovery, copy } from '@/utils/common'
import TableTemplate from '../common/table'
import ImgUpLoad from '@/views/common/imgUpload'
export default {
  name: 'Images',
  components: { TableTemplate, ImgUpLoad },
  data() {
    return {
      list: [],
      articleData: [],
      total: 0,
      loading: true,
      alterVisible: false,
      form: { url: '', title: '' },
      listQuery: { page: 1, title: '' },
      tableHeader: [
        { field: 'title', sortable: 'custom', title: '名称' },
        { field: 'url', title: '预览', img: 'url' },
        { field: 'url', title: '图片地址', event: 'copy' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '删除', field: 'handleDel', type: 'danger' }]
    }
  },
  watch: {
    alterVisible() {
      !this.alterVisible && this.search()
    }
  },
  created() {
    this.search()
  },
  methods: {
    recovery,
    copy,
    setIcon(url) {
      this.form.url = url
      this.copy(url)
      this.alterVisible = false
    },
    search() {
      this.loading = true
      search(this.listQuery).then(res => {
        this.loading = false
        this.list = res.list
        this.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    add() {
      this.alterVisible = true
      this.form = { title: '', url: '' }
    },
    handleDel(data) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        del({ id: data.id, url: data.url }).then(res => {
          this.search()
          this.$message.success('删除成功')
        })
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>
</style>
