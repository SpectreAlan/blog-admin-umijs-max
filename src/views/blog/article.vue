<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.account" placeholder="标题..." style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search()">查询</el-button>
      <el-button type="primary" class="filter-item" @click="handleAdd()">添加</el-button>
    </div>
    <!-- 表格区域 -->
    <table-template
      :table-header="tableHeader"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      :table-control="tableControl"
      @recovery="recovery"
      @handleEdit="handleEdit"
      @handleDel="handleDel"
      @handleStatus="handleStatus"
      @handleComment="handleComment"
    />
    <el-dialog :close-on-click-modal="false" title="添加置顶评论" :visible.sync="alterVisible" width="400px">
      <el-input
        v-model.trim="form.comment"
        type="textarea"
        :rows="4"
      />
      <span slot="footer" class="dialog-footer"><el-button type="primary" @click="ok()">确 定</el-button></span>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination :current-page.sync="listQuery.page" layout="total, prev,pager, next" :total="total" background @current-change="search" />
  </div>
</template>

<script>
import { list, status, del } from '@/api/blog'
import { add } from '@/api/comment'
import { recovery } from '@/utils/common'
import TableTemplate from '../common/table'
export default {
  name: 'Article',
  components: { TableTemplate },
  data() {
    return {
      list: [],
      listQuery: { page: 1, title: '' },
      loading: false,
      tableHeader: [
        { field: 'title', sortable: 'custom', title: '标题' },
        { field: 'category', sortable: 'custom', title: '分类', width: '120px' },
        { field: 'tags', sortable: 'custom', title: '标签' },
        { field: 'readed', sortable: 'custom', title: '阅读数', width: '100px' },
        { field: 'cover', title: '封面图', width: '150px', img: 'cover' },
        { field: 'status', title: '发布状态', switch: 'handleStatus', inactive: 0, active: 1, width: '80px' },
        { field: 'createTime', title: '创作时间' },
        { field: 'updateTime', title: '更新时间' },
        { field: 'remark', title: '备注' },
        { field: 'toolbar', title: '操作', width: '240px' }
      ],
      toolbarList: [{ title: '添加置顶评论', field: 'handleComment', type: 'success' }, { title: '编辑', field: 'handleEdit', type: 'primary' }, { title: '删除', field: 'handleDel', type: 'danger' }],
      total: 0,
      tableControl: true,
      alterVisible: false,
      form: { comment: '' }
    }
  },
  created() {
    this.search()
  },
  methods: {
    recovery,
    search() {
      this.loading = true
      list(this.listQuery).then(res => {
        this.list = res.list
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleEdit(data) {
      this.$router.push({
        name: 'Write',
        query: {
          id: data.id
        }
      })
    },
    handleAdd() {
      this.$router.push({
        name: 'Write'
      })
    },
    handleComment(item) {
      this.form.id = item.id
      this.form.title = item.title
      this.form.createTime = item.createTime
      this.form.comment = ''
      this.alterVisible = true
    },
    ok() {
      if (!this.form.comment) {
        this.$message.error('内容不能为空')
      }
      add(this.form).then(() => {
        this.$message.success('添加成功')
        this.alterVisible = false
      })
    },
    handleStatus(data) {
      this.loading = true
      status({ id: data.id, status: data.status }).then(res => {
        this.loading = false
        this.$message.success('编辑成功')
      }).catch(() => {
        this.search()
      })
    },
    handleDel(data) {
      this.$confirm('确认删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ id: data.id }).then(res => {
          this.$message.success('删除成功')
          this.search()
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style scoped>
</style>

