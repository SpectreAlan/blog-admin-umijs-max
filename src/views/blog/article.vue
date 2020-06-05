<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim.trim="listQuery.account" placeholder="标题..." style="width: 200px;" clearable />
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
    />
    <!-- 分页 -->
    <el-pagination :current-page.sync="listQuery.page" layout="total, prev,pager, next" :total="total" background @current-change="search" />
  </div>
</template>

<script>
import { list, status, del } from '@/api/blog'
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
        { field: 'category', sortable: 'custom', title: '分类' },
        { field: 'tags', sortable: 'custom', title: '标签' },
        { field: 'readed', sortable: 'custom', title: '阅读数' },
        { field: 'cover', title: '封面图', width: '200px', img: 'cover' },
        { field: 'status', title: '展示状态', switch: 'handleStatus', inactive: 0, active: 1 },
        { field: 'createTime', title: '创作时间' },
        { field: 'updateTime', title: '更新时间' },
        { field: 'remark', title: '备注' },
        { field: 'toolbar', title: '操作', width: '200px' }
      ],
      toolbarList: [{ title: '编辑', field: 'handleEdit', type: 'primary' }, { title: '删除', field: 'handleDel', type: 'danger' }],
      total: 0,
      tableControl: true
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
      console.log(data)
    },
    handleAdd() {
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
      if (data.status) {
        this.$message.error('删除前请先禁用它！')
        return
      }
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

