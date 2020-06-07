<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim.trim="listQuery.title" placeholder="标签名称" style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search()">查询</el-button>
      <el-button type="primary" class="filter-item" @click="search">添加</el-button>
    </div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="300px" label="标签名称">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)"> 取消 </el-button>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="更新时间">
        <template slot-scope="{row}"> <span>{{ row.updateTime }}</span></template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="文章数量">
        <template slot-scope="{row}"><span>{{ row.count }}</span></template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="{row}">
          <el-button v-if="row.edit" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">确认</el-button>
          <template v-else>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="row.edit=!row.edit"> 编辑 </el-button>
            <el-button type="success" size="small" @click="row.edit=!row.edit"> 查看所属文章 </el-button>
            <el-button type="danger" size="small" @click="row.edit=!row.edit"> 删除 </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { tags } from '@/api/blog'

export default {
  name: 'Tags',
  data() {
    return {
      list: [],
      loading: true,
      listQuery: { page: 1, title: '' }
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.loading = true
      tags(this.listQuery).then(res => {
        this.loading = false
        this.list = res.list.map(v => {
          this.$set(v, 'edit', false)
          v.originalTitle = v.title
          return v
        })
        this.loading = false
        this.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
