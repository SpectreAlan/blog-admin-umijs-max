<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.role_name" placeholder="角色名称" style="width: 200px;" class="filter-item" clearable />
      <div class="time-choose-box">
        <div class="time-choose">
          <el-button type="primary" @click="search()">查询</el-button>
          <el-button type="primary" @click="handleAdd()">添加</el-button>
        </div>
      </div>
    </div>
    <!-- 表格区域 -->
    <table-template
      :table-header="tableHeader"
      :list="list"
      :list-loading="listLoading"
      :toolbar-list="toolbarList"
      @handleStatus="handleStatus"
      @handleEdit="handleEdit"
      @handleDel="handleDel"
    />
    <!-- 新增 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="title">
      <el-form ref="role" :model="role" label-width="80px" label-position="left" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model.trim="role.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="!treeLoading" label="授权">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="tree"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
        <el-form-item v-if="treeLoading" label="授权">
          <div class="loading">
            <el-main
              v-loading="treeLoading"
              element-loading-text="数据加载中..."
            />
          </div>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmRole">提交</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination :current-page.sync="listQuery.page" layout="total, prev,pager, next" :total="total" background @current-change="search" />
  </div>
</template>

<script>
import { list, add, del, edit } from '@/api/role'
import TableTemplate from '../common/table'
export default {
  name: 'Role',
  components: { TableTemplate },
  data() {
    return {
      change: false,
      rules: { name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] },
      role: { name: '', status: 1, sysMenuIds: [] },
      dialogVisible: false,
      title: '添加角色',
      treeLoading: false,
      listLoading: false,
      list: [],
      total: 0,
      listQuery: { page: 1, role_name: '' },
      editData: '',
      tree: [],
      menus: [],
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableHeader: [
        { field: 'role_name', title: '角色名称', fixed: 'left' },
        { field: 'status', title: '角色状态', switch: 'handleStatus', inactive: 0, active: 1, width: '80px' },
        { field: 'update_time', title: '更新时间' },
        { field: 'toolbar', fixed: 'right', title: '操作' }
      ],
      toolbarList: [{ title: '编辑', field: 'handleEdit', type: 'primary' }, { title: '删除', field: 'handleDel', type: 'danger' }
      ]
    }
  },
  watch: {
    dialogVisible(n) {
      if (!n) {
        this.$nextTick(() => {
          this.$refs.role.clearValidate()
        })
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    search(k) {
      this.listLoading = true
      k && (this.listQuery.page = k.page)
      list(this.listQuery).then(res => {
        this.total = res.total
        this.list = res.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAdd() {
      this.getTree()
      this.dialogVisible = true
      this.role = this.$options.data().role
    },
    handleStatus(data) {
      this.listLoading = true
      edit(data).then(res => {
        this.listLoading = false
        if (res.code) {
          this.$message.success('操作成功')
        } else {
          this.search()
        }
      }).catch(() => {
        this.search()
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
    getTree(item) {
      this.treeLoading = true
      edit({ id: 0,
        name: '',
        pageNum: 1,
        pageSize: 10 }).then(res => {
        if (res.data) {
          const arr = res.data.list
          const first_leval = []
          const other = {}
          for (let i = 0; i < arr.length; i++) {
            const obj = {}
            obj.id = arr[i].id
            obj.name = arr[i].name
            if (arr[i].parentId) {
              obj.parentId = arr[i].parentId
              !other[arr[i].parentId] && (other[arr[i].parentId] = [])
              other[arr[i].parentId].push(obj)
            } else {
              first_leval.push(obj)
            }
          }
          this.treeSort(first_leval, other)
          this.tree = first_leval
          this.$refs.tree.setCheckedKeys([])
          this.treeLoading = false
          item && this.generateTree(item.id)
        }
      }).catch(() => { this.treeLoading = false })
    },
    generateTree(id) {
      edit({ id }).then(res => {
        if (res.code) {
          const list = []
          res.data.map(k => {
            list.push(k.menuId)
          })
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(list)
          })
        }
      }).catch(() => {})
    },
    confirmRole() {
      this.role.sysMenuIds = this.$refs.tree.getCheckedKeys()
      if (!this.role.sysMenuIds.length) {
        this.$message.error('请选择授权项')
        return
      }
      const url = this.title === '添加角色' ? '/sysRole/addData.do' : '/sysRole/editData.do'
      console.log(url)
      this.$refs['role'].validate((valid) => {
        if (valid) {
          add(this.role).then(res => {
            if (res.code) {
              this.$message.success('提交成功')
              this.dialogVisible = false
              this.search()
            }
          }).catch(() => {})
        } else {
          this.$message.error('请填写完整')
        }
      })
    },
    handleEdit(item) {
      this.role.id = item.id
      this.role.name = item.name
      this.getTree(item)
      this.title = '编辑角色'
      this.dialogVisible = true
    },
    handleDel(item) {
      this.$confirm('确认删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ roleId: item.id }).then(res => {
          this.$message.success('删除成功')
          this.search()
        }).catch(() => {})
      }).catch(() => {
      })
    }
  }
}
</script>
<style>
</style>

