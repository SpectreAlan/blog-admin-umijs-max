<template>
  <div class="app-container">
    <div class="filter-container menu">
      <div class="time-choose-box">
        <div class="time-choose">
          <el-button type="primary" @click="handleAdd()">添加</el-button>
        </div>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        class-name="table-align-left"
        prop="menu_name"
        label="名称"
        width="250"
      />
      <el-table-column
        prop="menu_type"
        label="类型"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag size="small" :type="row.menu_type === 1 ? 'success' : row.menu_type === 2 ? 'info' : ''">{{ types[row.menu_type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="parent_name"
        label="父节点"
        align="center"
      />
      <el-table-column
        prop="permission"
        label="权限"
        align="center"
      />
      <el-table-column
        prop="menu_key"
        label="路由地址"
        align="center"
      />
      <el-table-column
        prop="menu_order"
        label="序号"
        align="center"
      />
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="图标"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.icon" class="icon-box">
            <svg-icon :icon-class="scope.row.icon" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="note"
        label="备注"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(row)"
          >编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDel(row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddOrEdit v-if="visible" :visible="visible" :info="info" :list="list" @close="close" />
  </div>
</template>

<script>
import { menu } from '@/api/menu'
import { types } from './config'
import AddOrEdit from './addOrEdit'
export default {
  name: 'Menu',
  components: { AddOrEdit },
  data() {
    return {
      types,
      list: [],
      total: 0,
      info: null,
      visible: false,
      listLoading: false,
      o: null
    }
  },
  created() {
    this.search()
  },
  methods: {
    close(refresh) {
      this.visible = false
      refresh === 1 && this.search()
    },
    search() {
      this.listLoading = true
      this.list = []
      this.o = {}
      menu('search').then(arr => {
        const other = {}
        for (let i = 0; i < arr.length; i++) {
          this.o[arr[i].id] = arr[i].menu_name
          const obj = { ...arr[i] }
          if (arr[i].parentId) {
            obj.parentId = arr[i].parentId
            !other[arr[i].parentId] && (other[arr[i].parentId] = [])
            other[arr[i].parentId].push(obj)
          } else {
            this.list.push(obj)
          }
        }
        this.treeSort(this.list, other)
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    treeSort(arr, obj) {
      for (let i = 0; i < arr.length; i++) {
        if (obj[arr[i].id]) {
          arr[i]['children'] = obj[arr[i].id]
          delete obj[arr[i].id]
          this.treeSort(arr[i]['children'], obj)
        }
      }
    },
    handleAdd() {
      this.info = null
      this.visible = true
    },
    handleEdit(data) {
      this.info = { ...data }
      this.visible = true
    },
    handleDel(data) {
      this.listLoading = true
      menu('del', { id: data.id }).then(() => {
        this.search()
      }).catch(() => { this.listLoading = false })
    }
  }
}
</script>
<style scoped>
  .menu {
    margin-bottom: 20px;
  }
</style>

