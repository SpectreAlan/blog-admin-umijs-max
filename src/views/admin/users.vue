<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim.trim="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" />
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
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @recovery="recovery"
      @edit="handleEdit"
      @del="handleDel"
      @status="handleStatus"
    />
    <!-- 新增/编辑发现 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :model="form" label-width="110px" size="mini" :rules="rules">
        <el-form-item label="账号" prop="account">
          <el-input v-model.trim="form.account" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model.trim="form.nickName" />
        </el-form-item>
        <ImgUpload label="头像" :icon="form.avatar" @setIcon="setIcon" />
        <el-form-item label="角色" prop="role">
          <el-select ref="role" v-model="form.role" placeholder="选择用户角色" clearable class="filter-item">
            <el-option v-for="(v,k,i) in roles" :key="i" :label="v" :value="k" />
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
    <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" @pagination="search" />
  </div>
</template>

<script>
import { list, add, del, edit } from '@/api/permission'
import { recovery } from '@/utils/common'
import TableTemplate from '../common/table'
import Pagination from '@/components/Pagination'
import ImgUpload from '@/views/common/imgUpload'
export default {
  name: 'Users',
  components: { TableTemplate, Pagination, ImgUpload },
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      form: {
        account: '',
        nickName: '',
        role: '',
        remark: '',
        status: 1,
        avatar: ''
      },
      roles: [],
      dialogVisible: false,
      reqLoading: false,
      list: [],
      listQuery: {
        page: 1,
        account: ''
      },
      loading: false,
      tableHeader: [
        { field: 'account', sortable: 'custom', title: '账号' },
        { field: 'nickName', sortable: 'custom', title: '昵称' },
        { field: 'avatar', sortable: 'custom', title: '头像', width: '200px', img: 'avatar' },
        { field: 'status', title: '状态', switch: 'handleStatus', inactive: 0, active: 1 },
        { field: 'role', title: '角色' },
        { field: 'createTime', title: '创建时间', width: '100px' },
        { field: 'updateTime', title: '更新时间', width: '100px' },
        { field: 'updateBy', title: '操作人', width: '100px' },
        { field: 'remark', title: '备注', width: '100px' },
        { field: 'toolbar', title: '操作', width: '200px' }
      ],
      toolbarList: [{ title: '编辑', field: 'handleEdit', type: 'primary' }, { title: '删除', field: 'handleDel', type: 'danger' }],
      total: 0,
      title: '添加'
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
    recovery,
    setIcon(url) {
      this.form.avatar = url
    },
    search() {
      this.loading = true
      list(this.listQuery).then(res => {
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
          this.reqLoading = true
          if (this.title === '编辑') {
            edit(this.form).then(res => {
              this.$message.success(res.msg)
              this.reqLoading = false
              this.search()
            })
          } else {
            add(this.form).then(res => {
              this.$message.success(res.msg)
              this.reqLoading = true
              this.search()
            })
          }
        }
      })
    },
    handleEdit(data) {
      this.title = '编辑'
      this.dialogVisible = true
      this.form.id = data.id
      for (const i in this.form) {
        this.form[i] = data[i]
      }
    },
    handleAdd() {
      this.form = { ...{}, ...this.$options.data().form }
      this.title = '添加'
      this.dialogVisible = true
    },
    handleStatus(data) {
      this.loading = true
      edit({ id: data.id, status: data.status }).then(res => {
        this.$message.success(res.msg)
        this.loading = false
      }).catch(() => {
        this.loading = false
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
        del({ id: data.id }).then(res => {
          this.$message.success(res.msg)
          this.search()
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style scoped>
.tipsRed{
  color:red;
}
</style>

