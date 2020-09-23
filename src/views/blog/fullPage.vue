<template>
  <div class="app-container">
    <table-template
      :table-header="tableHeader"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @recovery="recovery"
      @handleDel="handleDel"
    />
    <el-pagination :current-page.sync="page" layout="total, prev,pager, next" :total="total" background @current-change="search" />
  </div>
</template>

<script>
import { del, search } from '@/api/fullPage'
import { recovery, copy } from '@/utils/common'
import TableTemplate from '../common/table'
export default {
  name: 'FullPage',
  components: { TableTemplate },
  data() {
    return {
      list: [],
      loading: true,
      page: 1,
      total: 0,
      tableHeader: [
        { field: 'url', title: '预览', img: 'url' },
        { field: 'url', title: '图片地址', event: 'copy' },
        { field: 'create_time', title: '创建时间' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '删除', field: 'handleDel', type: 'danger' }]
    }
  },
  created() {
    this.search()
  },
  methods: {
    recovery,
    copy,
    search(param) {
      this.loading = true
      this.page = param || 1
      search({ page: this.page }).then(res => {
        this.loading = false
        this.list = res.list
        this.total = res.total
      }).catch(() => {
        this.loading = false
      })
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
        })
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>
</style>
