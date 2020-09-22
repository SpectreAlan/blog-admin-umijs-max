<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.article_title" placeholder="标题..." style="width: 200px;" clearable />
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
import { list, del } from '@/api/blog'
import { edit } from '@/api/write'
import { add } from '@/api/comment'
import { recovery } from '@/utils/common'
import TableTemplate from '../common/table'
export default {
  name: 'Article',
  components: { TableTemplate },
  data() {
    return {
      list: [],
      listQuery: { page: 1, article_title: '' },
      loading: false,
      tableHeader: [
        { field: 'article_title', sortable: 'custom', title: '标题' },
        { field: 'category_name', sortable: 'custom', title: '分类', width: '120px' },
        { field: 'tag_name', sortable: 'custom', title: '标签' },
        { field: 'readed', sortable: 'custom', title: '阅读数', width: '100px' },
        { field: 'cover', title: '封面图', width: '150px', img: 'cover' },
        { field: 'status', title: '发布状态', switch: 'handleStatus', inactive: 0, active: 1, width: '80px' },
        { field: 'create_time', title: '创作时间' },
        { field: 'update_time', title: '更新时间' },
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.search({ page: 1, article_title: '' })
    })
  },
  methods: {
    recovery,
    search(param) {
      param = typeof param === 'number' ? this.listQuery : param
      this.loading = true
      list(param).then(res => {
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
      console.log(item)
      this.form.id = item.id
      this.form.article_title = item.article_title
      this.form.create_time = item.create_time
      this.form.comment = ''
      this.alterVisible = true
    },
    ok() {
      if (!this.form.comment) {
        this.$message.error('内容不能为空')
      }
      add(this.form).then(() => {
        this.alterVisible = false
      })
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
      this.$confirm('确认删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ id: data.id }).then(() => {
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

