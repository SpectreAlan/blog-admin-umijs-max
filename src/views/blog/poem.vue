<template>
  <div class="app-container">
    <el-select ref="role" v-model="listQuery.type_name" clearable class="filter-item" placeholder="选择类型">
      <el-option v-for="(v, k,i) in types" :key="i" :label="v" :value="k" />
    </el-select>
    <!-- 表格区域 -->
    <nice-table :table-header="tableHeader" :formatter="formatter" :list="list" :toolbar-list="toolbarList" :list-loading="loading" @emitEvent="(args)=>this.$emitEvent(args)" />
    <!-- 分页 -->
    <nice-pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="search" />
  </div>
</template>

<script>
import { del, search } from '@/api/poem'

export default {
  name: 'Poem',
  data() {
    return {
      list: [],
      loading: true,
      listQuery: { page: 1, type_name: '', limit: 10 },
      total: 0,
      types: {
        a: '动画',
        b: '漫画',
        c: '游戏',
        d: '文学',
        e: '原创',
        f: '来自网络',
        g: '其他',
        h: '影视',
        i: '诗词',
        j: '网易云',
        k: '哲学',
        l: '抖机灵'
      },
      type: '',
      tableHeader: [
        { field: 'poem', title: '内容' },
        { field: 'create_time', title: '创建时间' },
        { field: 'type_name', title: '类别', formatter: 'type_name' },
        { field: 'author', title: '来源' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '删除', field: 'handleDel', type: 'danger' }]
    }
  },
  watch: {
    'listQuery.type_name': {
      handler() {
        this.search()
      },
      deep: true
    }
  },
  created() {
    this.search()
    this.stateSearch()
  },
  methods: {
    formatter(row, field) {
      return this.types[row[field]]
    },
    search(k) {
      k && (this.listQuery.page = k.page)
      this.loading = true
      search(this.listQuery).then(res => {
        this.loading = false
        this.list = res.list
        this.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    stateSearch() {
    },
    handleDel(data) {
      this.loading = true
      del({ id: data.id }).then(() => {
        this.search()
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>
</style>
