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
          {{ row.menu_type === 1 ? '菜单' : '按钮' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="permission"
        label="权限"
        align="center"
      />
      <el-table-column
        prop="menu_key"
        label="菜单编码"
        align="center"
      />
      <el-table-column
        prop="menu_order"
        label="序号"
        align="center"
      />
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
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDel(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :model="form" label-width="110px" :rules="rules">
        <el-form-item label="名称" prop="menu_name">
          <el-input v-model.trim="form.menu_name" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.menu_type">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="0">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.menu_type === 1" label="菜单编码" prop="menu_key">
          <el-input v-model.trim="form.menu_key" placeholder="请输入4~16位纯英文" clearable :disabled="title==='编辑菜单'" />
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-input v-model.trim="form.permission" placeholder="格式形如:user:add" clearable />
        </el-form-item>
        <el-form-item label="序号" prop="menu_order">
          <el-input v-model.trim="form.menu_order" />
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-input v-model="parentInfo" readonly placeholder="点击选择" @focus="treeVisible = true" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model.trim="form.note" />
        </el-form-item>
        <div class="center">
          <el-button type="primary" size="medium " @click="onSubmit">立即提交</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--    菜单树-->
    <el-dialog :close-on-click-modal="false" title="选择菜单" :visible.sync="treeVisible" width="300px">
      <el-tree
        :data="list"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
      />
    </el-dialog>
  </div>
</template>

<script>
import { list, add, del, edit } from '@/api/menu'
export default {
  name: 'Menu',
  data() {
    const menu_key = (rule, value, callback) => {
      if (!(/^[0-9a-zA-Z]{4,16}$/.test(value))) {
        callback(new Error('code应为4-16个字符,可使用字母、数字(不包含空格)'))
      } else {
        callback()
      }
    }
    const menu_order = (rule, value, callback) => {
      const reg = /^([1-9]\d*)(\.\d+)?$/g
      if (!(reg.test(value))) {
        callback(new Error('请输入大于0的数'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        menu_name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        menu_key: [
          { required: true, message: '请输入code', trigger: 'blur' },
          { validator: menu_key, trigger: 'blur' }
        ],
        menu_order: [
          { required: true, message: '请输入序号', trigger: 'blur' },
          { validator: menu_order, trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择父级菜单', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'menu_name'
      },
      parentInfo: '',
      list: [],
      total: 0,
      title: '添加菜单',
      dialogVisible: false,
      treeVisible: false,
      listLoading: false,
      form: {
        menu_code: '',
        note: '',
        menu_name: '',
        permission: '',
        parentId: 0,
        menu_order: 0,
        menu_type: 0
      },
      o: null,
      detail: {}
    }
  },
  watch: {
    dialogVisible() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.listLoading = true
      this.list = []
      this.o = {}
      list().then(arr => {
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
    handleNodeClick(data) {
      if (data.menu_type === 0) {
        this.$message.error('父节点不能是按钮')
        return
      }
      this.parentInfo = data.menu_name
      this.form.parentId = data.id
      this.treeVisible = false
    },
    handleAdd() {
      this.form = this.$options.data().form
      this.title = '添加菜单'
      this.parentInfo = ''
      this.dialogVisible = true
    },
    handleEdit(data) {
      this.detail = { ...data }
      this.form = { ...data }
      this.parentInfo = this.o[data.parentId] || '顶层菜单'
      this.title = '编辑菜单'
      this.dialogVisible = true
    },
    handleDel(data) {
      del({ id: data.id }).then(res => {
        this.$message.success('删除成功')
        this.search()
      })
    },
    onSubmit() {
      let go = true
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          go = false
        }
      })
      if (!go) { return }
      if (this.form.menu_type === 2 && this.form.parentId === 0) {
        this.$message.error('请指定按钮父级')
        return
      }
      if (this.title === '添加菜单') {
        add(this.form).then(res => {
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.search()
        })
      } else {
        if (this.form.menu_key !== this.detail.menu_key) {
          this.$message.error('非法操作，请勿修改菜单编码')
          return
        }
        edit(this.form).then(res => {
          this.$message.success('编辑成功')
          this.dialogVisible = false
          this.search()
        })
      }
    }
  }
}
</script>
<style scoped>
  .menu{
    margin-bottom: 20px;
  }
</style>

