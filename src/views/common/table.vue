<template>
  <div class="table">
    <ul v-if="tableControl" class="table-control">
      <li class="table-control-choose">
        <el-tooltip class="item" effect="dark" content="筛选列" placement="top-start">
          <i ref="tableControlBox" class="el-icon-menu" @click.stop="tableControlBox = !tableControlBox" />
        </el-tooltip>
        <div v-show="tableControlBox" ref="controlBox" class="table-control-box">
          <el-checkbox-group
            v-model="tableHeaderList"
            :min="1"
          >
            <ul>
              <li v-for="item in tableHeader" :key="item.index">
                <el-checkbox :label="item.title" @change="tableControlBox = true">{{ item.title }}</el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="导出表格" placement="top-start">
          <i class="el-icon-download" @click="toExcel" />
        </el-tooltip>
      </li>
    </ul>
    <el-table
      v-loading="listLoading"
      class="vip-container"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :size="size"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="selectable"
        type="selection"
        :selectable="selectable"
        width="40"
      />
      <template v-for="(k,v) in tableHeader">
        <el-table-column
          v-if="tableHeaderList.includes(k.title)"
          :key="v"
          :label="k.title"
          :width="k.width"
          :min-width="k.minWidth"
          :sortable="k.sortable"
          :prop="k.field"
          align="center"
          :fixed="k.fixed"
          :class-name="k.className"
          :show-overflow-tooltip="k.tooltip"
        >
          <template slot-scope="{row}">
            <template v-if="k.slot">
              <slot :name="k.field" :data="row" />
            </template>
            <template v-else-if="k.switch">
              <el-switch
                v-model="row[k.field]"
                :active-color="k.activeColor || '#13ce66'"
                :inactive-color="k.inactiveColor || '#ff4949'"
                :active-text="k.activeText"
                :inactive-text="k.inactiveText"
                :active-value="k.active"
                :inactive-value="k.inactive"
                @change="control(k.switch, row)"
              />
            </template>
            <template v-else-if="k.img">
              <el-image
                class="imgIcon"
                :src="row[k.img]"
                :preview-src-list="[row[k.img]]"
              />
            </template>
            <template v-else-if="k.field ==='toolbar'">
              <div v-for="(item, index) in toolbarList" :key="index" class="tableControlButton">
                <template v-if="item.show">
                  <el-button
                    v-if="show(item.field, row)"
                    :type="item.type"
                    size="mini"
                    @click="control(item.field, row)"
                  >{{ item.title }}</el-button>
                </template>
                <template v-else-if="item.disable">
                  <el-button
                    :type="item.type"
                    :disabled="disable(item.field, row)"
                    size="mini"
                    @click="control(item.field, row)"
                  >{{ item.title }}</el-button>
                </template>
                <template v-else>
                  <el-button
                    :type="item.type"
                    size="mini"
                    @click="control(item.field, row)"
                  >{{ item.title }}</el-button>
                </template>
              </div>
            </template>
            <template v-else-if="k.field ==='customizeToolbar'">
              <el-popover
                trigger="hover"
                placement="left"
              >
                <ul class="popover-list">
                  <li v-for="(key,index) in toolbarList" :key="index" @click.stop="control(key.key, row)">{{ key.title }}</li>
                </ul>
                <div slot="reference" class="moreControl">...</div>
              </el-popover>
            </template>
            <template v-else-if="!k.slot">
              <div :class="k.tooltip ? 'event':''" @click="control(k.field, row, k.tooltip)">{{ k.formatter ? formatter(row, k.field) : row[k.field] || '-' }}</div>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
import { exportExcel } from './excel'
import { copy } from '@/utils/common'
export default {
  name: 'Table',
  props: {
    tableHeader: {
      type: Array,
      default() {
        return []
      }
    },
    formatter: {
      type: Function,
      default() {
        return ''
      }
    },
    show: {
      type: Function,
      default() {
        return ''
      }
    },
    disable: {
      type: Function,
      default() {
        return ''
      }
    },
    moduleType: {
      type: String,
      default() {
        return ''
      }
    },
    selectable: {
      type: Boolean,
      default() {
        return false
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    toolbarList: {
      type: Array,
      default() {
        return []
      }
    },
    tableControl: {
      type: Boolean,
      default() {
        return false
      }
    },
    listLoading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      sort: null,
      tableData: [],
      excel: {},
      tableControlBox: false,
      tableHeaderList: [],
      downloadLoading: false,
      path: '',
      multipleSelectionData: '',
      all: {}
    }
  },
  computed: {
    size() {
      return this.$store.state.size
    }
  },
  watch: {
    tableHeader() {
      this.viewItem()
    },
    tableHeaderList() {
      this.excelData()
    },
    'list': {
      handler() {
        if (this.list && this.list.length > 0) {
          this.tableData = [...this.list]
          this.sort && this.sortChange(this.sort)
        } else {
          this.tableData = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.viewItem()
    this.path = this.$route.path
  },
  mounted() {
    document.addEventListener('click', (e) => {
      this.tableControlBox = false
    })
  },
  beforeDestroy() {
    localStorage.removeItem(this.path)
  },
  methods: {
    copy,
    viewItem() {
      for (let i = 0; i < this.tableHeader.length; i++) {
        this.all[this.tableHeader[i].title] = this.tableHeader[i].field
        this.tableHeaderList.push(this.tableHeader[i].title)
      }
      this.excelData()
    },
    control(k, row, copyText) {
      if (copyText) {
        copy(row[k])
        return
      }
      this.$emit('emitEvent', { fn: k, data: row })
    },
    sortChange(data) {
      this.sort = data
      const key = this.path
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(this.tableData))
      }
      if (data.prop === null) {
        this.$emit('recovery', key)
      }
      const order = data.order === 'ascending' ? 1 : -1
      const type = data.prop
      this.tableData.sort(this.compare(type, order))
    },
    compare(type, order) {
      return function(a, b) {
        const v1 = a[type]
        const v2 = b[type]
        const result = v1 < v2 ? -1 : v1 > v2 ? 1 : 0
        return result * order
      }
    },
    exportExcel,
    excelData() {
      this.excel = {}
      for (let i = 0; i < this.tableHeaderList.length; i++) {
        this.excel[this.tableHeaderList[i]] = this.all[this.tableHeaderList[i]]
      }
    },
    toExcel() {
      const o = {
        list: [...this.tableData, ...[]],
        keys: Object.values(this.excel),
        names: Object.keys(this.excel)
      }
      this.exportExcel(o)
    }
  }
}
</script>
<style scoped lang="scss">
  .table {
    margin-top: 10px;
    .moreControl{
      display: inline-block;
      height:25px;
      width:40px;
      line-height:18px;
      border: 1px solid #8c939d;
      color: #000;
      border-radius: 8px;
      cursor: pointer;
    }
    .tableControlButton{
      display: inline-block;
    }
    .imgIcon{
      max-width: 100px;
    }
    .event{
      cursor: pointer;
    }
  }
  .popover-list{
    text-align: center;
    li{
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
  .ellipsis,.ellipsisCursor{
    display: block;
    height: 17px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
