<template>
  <div class="app-container">
    <el-select ref="role" v-model="listQuery.type" clearable class="filter-item" placeholder="选择类型">
      <el-option v-for="(v, k,i) in types" :key="i" :label="v" :value="k" />
    </el-select>
    <table-template
      :table-header="tableHeader"
      :list="list"
      :formatter="formatter"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @recovery="recovery"
      @handleDel="handleDel"
    />
    <el-pagination :current-page.sync="listQuery.page" layout="total, prev,pager, next" :total="total" background @current-change="search" />
  </div>
</template>

<script>
import { del, search } from '@/api/poem'
import { recovery } from '@/utils/common'
import TableTemplate from '../common/table'
export default {
  name: 'Poem',
  components: { TableTemplate },
  data() {
    return {
      list: [],
      loading: true,
      listQuery: { page: 1, type: '' },
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
        { field: 'createTime', title: '创建时间' },
        { field: 'type', title: '类别', formatter: 'type' },
        { field: 'author', title: '来源' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '删除', field: 'handleDel', type: 'danger' }]
    }
  },
  watch: {
    'listQuery.type': {
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
    formatter(type) {
      return this.types[type]
    },
    recovery,
    search(param) {
      this.listQuery.page = param || 1
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
      del({ id: data.id, url: data.url }).then(() => {
        this.search()
        this.$message.success('删除成功')
      })
    }
  }
}
</script>

<style scoped>
</style>
