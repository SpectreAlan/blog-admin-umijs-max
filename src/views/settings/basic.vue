<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="filter-item" @click="handleAdd()">添加</el-button>
    </div>
    <!-- 表格区域 -->
    <nice-table :table-header="tableHeader" :list="list" :toolbar-list="toolbarList" :list-loading="loading" @emitEvent="(args)=>this.$emitEvent(args)" />
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-form-item label="名称" prop="setting_title">
          <el-input v-model.trim="form.setting_title" />
        </el-form-item>
        <el-form-item label="标识" prop="setting_key">
          <el-input v-model.trim="form.setting_key" placeholder="长度4至8位，以字母开头，字母，数字，减号，下划线" />
        </el-form-item>
        <el-form-item label="内容" prop="setting_content">
          <el-input v-model.trim="form.setting_content" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="reqLoading" size="medium " @click="onSubmit">立即提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { list, edit, add } from '@/api/settings'

export default {
  name: 'Basic',
  data() {
    return {
      list: [],
      loading: false,
      dialogVisible: false,
      reqLoading: false,
      tableHeader: [
        { field: 'setting_title', sortable: 'custom', title: '标题' },
        { field: 'setting_key', sortable: 'custom', title: '标识' },
        { field: 'setting_content', sortable: 'custom', title: '内容' },
        { field: 'remark', title: '备注' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '编辑', field: 'handleEdit', type: 'primary' }],
      total: 0,
      title: '',
      alterVisible: false,
      form: { setting_title: '', setting_key: '', setting_content: '', remark: '' }
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.loading = true
      list().then(res => {
        this.list = res
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleAdd() {
      this.dialogVisible = true
      this.title = '添加'
      this.form = this.$options.data().form
    },
    handleEdit(data) {
      this.title = '编辑'
      this.dialogVisible = true
      this.form = { ...data }
    },
    onSubmit() {
      this.title === '添加'
        ? add(this.form).then(() => {
          this.dialogVisible = false
          this.search()
        }) : edit(this.form).then(() => {
          this.dialogVisible = false
          this.search()
        })
    }
  }
}
</script>

