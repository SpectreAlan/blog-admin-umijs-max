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
    <nice-table :table-header="tableHeader" :list="list" :toolbar-list="toolbarList" :list-loading="listLoading" @emitEvent="(args)=>this.$emitEvent(args)" />
    <!-- 新增 -->
    <el-dialog :visible.sync="dialogVisible" :title="title">
      <el-form ref="role" :model="role" label-width="80px" label-position="left" :rules="rules">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model.trim="role.role_name" placeholder="请输入角色名称" clearable />
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
    <nice-pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="search" />
  </div>
</template>

<script>
import { list, add, del, edit } from '@/api/role'
import { menu } from '@/api/menu'
export default {
  name: 'Role',
  data() {
    return {
      change: false,
      rules: { role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] },
      role: { role_name: '', status: 1, role_keys: '' },
      dialogVisible: false,
      title: '添加角色',
      treeLoading: false,
      listLoading: false,
      list: [],
      role_keys: [],
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
      this.title = '添加角色'
    },
    handleStatus(data) {
      this.listLoading = true
      edit({ id: data.id, status: data.status }).then(() => {
        this.listLoading = false
      }).catch(() => {
        this.search()
      })
    },
    treeSort(list, obj, fathers) {
      for (let i = 0; i < list.length; i++) {
        if (obj[list[i].id]) {
          fathers.push(String(list[i].id))
          list[i]['children'] = obj[list[i].id]
          delete obj[list[i].id]
          this.treeSort(list[i]['children'], obj, fathers)
        }
      }
    },
    getTree(item) {
      const fathers = []
      this.treeLoading = true
      menu('search').then(list => {
        this.tree = []
        const childes = {}
        for (let i = 0; i < list.length; i++) {
          const obj = {}
          obj.id = list[i].id
          obj.name = list[i].menu_name
          if (list[i].parentId) { // 相同父级的子集存储到childes下以父级id为key的arr里面
            obj.parentId = list[i].parentId
            !childes[list[i].parentId] && (childes[list[i].parentId] = [])
            childes[list[i].parentId].push(obj)
          } else { // 顶级菜单
            this.tree.push(obj)
          }
        }
        this.treeSort(this.tree, childes, fathers)
        this.$refs.tree.setCheckedKeys([])
        this.treeLoading = false
        item && this.$nextTick(() => {
          const role_keys = item.role_keys.split(',') // 已被选中节点
          const checked = role_keys.filter(v => fathers.indexOf(v) === -1)
          this.$refs.tree.setCheckedKeys(checked)
        })
      }).catch(() => { this.treeLoading = false })
    },
    confirmRole() {
      this.role_keys = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
      if (!this.role_keys.length) {
        this.$message.error('请选择授权项')
        return
      }
      this.$refs['role'].validate((valid) => {
        this.role.role_keys = this.role_keys.join(',')
        if (valid) {
          this.title === '添加角色' ? this.addReq() : this.editReq()
        }
      })
    },
    addReq() {
      add(this.role).then(() => {
        this.dialogVisible = false
        this.search()
      }).catch(() => { this.dialogVisible = false })
    },
    editReq() {
      edit(this.role).then(() => {
        this.dialogVisible = false
        this.search()
      }).catch(() => { this.dialogVisible = false })
    },
    handleEdit(item) {
      this.role.id = item.id
      this.role.role_name = item.role_name
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
        this.listLoading = true
        del({ id: item.id }).then(res => {
          this.search()
        }).catch(() => { this.listLoading = false })
      }).catch(() => {
      })
    }
  }
}
</script>
<style>
</style>

