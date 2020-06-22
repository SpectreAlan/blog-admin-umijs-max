<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.title" placeholder="标签名称" style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search">查询</el-button>
      <el-button type="primary" class="filter-item" @click="add">添加</el-button>
    </div>
    <table-template
      :table-header="tableHeader"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @recovery="recovery"
      @handleEdit="handleEdit"
      @handleDel="handleDel"
      @handleShow="handleShow"
    />
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="alterVisible" width="20%">
      <el-input v-model.trim="form.title" />
      <span slot="footer" class="dialog-footer"><el-button type="primary" @click="ok()">确 定</el-button></span>
    </el-dialog>
    <el-dialog title="所属文章" :visible.sync="searchVisible">
      <el-table v-loading="articleLoading" :data="articleData">
        <el-table-column property="title" label="标题" />
        <el-table-column property="category" label="分类" />
        <el-table-column property="tags" label="标签" />
        <el-table-column property="status" label="发布状态">
          <template slot-scope="scope">
            {{ scope.row.status ? '已发布' : '未发布' }}
          </template>
        </el-table-column>
        <el-table-column property="updateTime" label="更新时间" />
      </el-table>
    </el-dialog>
    <el-pagination :current-page.sync="listQuery.page" layout="total, prev,pager, next" :total="total" background @current-change="search" />
  </div>
</template>

<script>
import { belong, edit, add, del, search } from '@/api/tags'
import { recovery } from '@/utils/common'
import TableTemplate from '../common/table'
export default {
  name: 'Tags',
  components: { TableTemplate },
  data() {
    return {
      list: [],
      articleData: [],
      total: 0,
      loading: true,
      title: '',
      form: {},
      alterVisible: false,
      searchVisible: false,
      articleLoading: false,
      listQuery: { page: 1, title: '' },
      tableHeader: [
        { field: 'title', sortable: 'custom', title: '标签名' },
        { field: 'updateTime', title: '更新时间' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '编辑', field: 'handleEdit', type: 'primary' }, { title: '查看所属文章', field: 'handleShow', type: 'success' }, { title: '删除', field: 'handleDel', type: 'danger' }]
    }
  },
  created() {
    this.search()
  },
  methods: {
    recovery,
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
    handleEdit(data) {
      this.title = '编辑标签'
      this.alterVisible = true
      this.form = { title: data.title, id: data.id }
    },
    handleShow(data) {
      this.searchVisible = true
      this.articleLoading = true
      belong({ tag: data.title }).then(res => {
        this.articleLoading = false
        this.articleData = res
        this.alterVisible = false
      }).catch(() => { this.articleLoading = false })
    },
    ok() {
      if (!this.form.title) { return }
      this.form.id ? edit(this.form).then(res => {
        this.search()
        this.$message.success('编辑成功')
        this.alterVisible = false
      }) : add(this.form).then(res => {
        this.search()
        this.$message.success('添加成功')
        this.alterVisible = false
      })
    },
    add() {
      this.alterVisible = true
      this.form = { title: '' }
      this.title = '新增标签'
    },
    handleDel(data) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        del({ id: data.id }).then(res => {
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
