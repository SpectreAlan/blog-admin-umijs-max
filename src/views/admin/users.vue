<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim.trim="listQuery.account" placeholder="账号..." style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search()">查询</el-button>
      <el-button type="primary" class="filter-item" @click="handleAdd()">添加</el-button>
    </div>
    <!-- 表格区域 -->
    <table-template
      :table-header="tableHeader"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      :formatter="formatter"
      :table-control="tableControl"
      @recovery="recovery"
      @handleEdit="handleEdit"
      @handleDel="handleDel"
      @handleStatus="handleStatus"
    />
    <!-- 新增/编辑-->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="form" label-width="100px" size="mini" :rules="rules">
        <el-form-item v-if="title==='添加'" label="账号" prop="account">
          <el-input v-model.trim="form.account" placeholder="长度4至8位，以字母开头，字母，数字，减号，下划线" />
        </el-form-item>
        <el-form-item label="密码" prop="user_pwd">
          <el-input v-model.trim="form.user_pwd" show-password placeholder="长度6至12位" />
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name">
          <el-input v-model.trim="form.nick_name" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <ImgUpLoad :img="form.avatar" :title="form.account" @setImg="setIcon" />
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select ref="role" v-model="form.role_id" placeholder="选择用户角色" clearable class="filter-item">
            <el-option v-for="(v, k,i) in roles" :key="i" :label="v" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="reqLoading" size="medium " @click="onSubmit">立即提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination :current-page.sync="listQuery.page" layout="total, prev,pager, next" :total="total" background @current-change="search" />
  </div>
</template>

<script>
import { list, signup, del, edit, getRoles } from '@/api/users' // 引入函数
import { recovery } from '@/utils/common'
import TableTemplate from '../common/table'
import ImgUpLoad from '@/views/common/imgUpload'

import md5 from 'md5'
export default {
  name: 'Users',
  components: { TableTemplate, ImgUpLoad },
  data() {
    return {
      rules: { account: [{ required: true, trigger: 'blur' }], role: [{ required: true, message: '请选择角色', trigger: 'change' }] },
      form: { account: '', nick_name: '', role_id: '', remark: '', status: 1, user_pwd: '', avatar: '' },
      roles: {},
      dialogVisible: false,
      reqLoading: false,
      list: [],
      listQuery: { page: 1, account: '' },
      loading: false,
      tableHeader: [
        { field: 'account', sortable: 'custom', title: '账号' },
        { field: 'nick_name', sortable: 'custom', title: '昵称' },
        { field: 'avatar', title: '头像', width: '200px', img: 'avatar' },
        { field: 'status', title: '账号启禁', switch: 'handleStatus', inactive: 0, active: 1 },
        { field: 'role_id', title: '角色', formatter: 'role_id' },
        { field: 'update_time', title: '更新时间' },
        { field: 'remark', title: '备注' },
        { field: 'toolbar', title: '操作', width: '200px' }
      ],
      toolbarList: [{ title: '编辑', field: 'handleEdit', type: 'primary' }, { title: '删除', field: 'handleDel', type: 'danger' }],
      total: 0,
      title: '添加',
      tableControl: true
    }
  },
  created() { // 组件创建的时候
    getRoles().then(res => {
      res.map(item => {
        this.roles[item.id] = item.role_name
      })
    })
    this.search() // 调用查询列表的函数
  },
  methods: {
    recovery,
    formatter(type) {
      return this.roles[type]
    },
    setIcon(url) {
      this.form.avatar = url
    },
    search() {
      this.loading = true
      list(this.listQuery).then(res => { // 请求后台接口
        this.list = res.list
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.title !== '添加' ? this.editReq() : this.addReq()
        }
      })
    },
    editReq() {
      if (this.form.user_pwd && (this.form.user_pwd.length > 13 || this.form.user_pwd.length < 6)) {
        this.$message.error('密码格式有误')
        return
      }
      this.reqLoading = true
      const param = { ...this.form }
      if (param.user_pwd) {
        param.user_pwd = md5(param.user_pwd)
      }
      edit(param).then(() => {
        this.reqLoading = false
        this.dialogVisible = false
        this.search()
      }).catch(() => {
        this.reqLoading = false
      })
    },
    addReq() {
      const param = { ...this.form }
      if (param.user_pwd.length > 13 || param.user_pwd.length < 6) {
        this.$message.error('密码格式有误')
        return
      }
      this.reqLoading = true
      param.user_pwd = md5(param.user_pwd)
      signup(param).then(res => {
        this.reqLoading = false
        this.dialogVisible = false
        this.search()
      }).catch(() => {
        this.reqLoading = false
      })
    },
    handleEdit(data) {
      this.title = '编辑 -  ' + data.account
      this.dialogVisible = true
      this.form.id = data.id
      for (const i in this.form) {
        this.form[i] = data[i]
      }
      this.form.role_id = String(data.role_id)
    },
    handleAdd() {
      this.form = { ...{}, ...this.$options.data().form }
      this.title = '添加'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleStatus(data) {
      this.loading = true
      edit(data).then(() => {
        this.loading = false
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
        this.loading = true
        del({ id: data.id }).then(() => {
          this.search()
          this.loading = false
        }).catch(() => { this.loading = false })
      }).catch(() => {
      })
    }
  }
}
</script>
<style scoped>
</style>

