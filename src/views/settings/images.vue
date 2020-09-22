<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.image_title" placeholder="图片名称" style="width: 200px;" clearable />
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
        <el-form-item label="图片名称" prop="image_title">
          <el-input v-model.trim="form.image_title" clearable />
        </el-form-item>
        <el-form-item label="图片" prop="avatar">
          <ImgUpLoad :img="form.image_url" :title="form.image_title" @setImg="setIcon" />
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
      form: { image_url: '', image_title: '' },
      listQuery: { page: 1, image_title: '' },
      tableHeader: [
        { field: 'image_title', sortable: 'custom', title: '名称' },
        { field: 'image_url', title: '预览', img: 'image_url' },
        { field: 'image_url', title: '图片地址', event: 'copy' },
        { field: 'create_time', title: '创建时间' },
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
      this.form.image_url = url
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
      this.form = { image_title: '', image_url: '' }
    },
    handleDel(data) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        del(data).then(() => {
          this.search()
        })
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>
</style>
