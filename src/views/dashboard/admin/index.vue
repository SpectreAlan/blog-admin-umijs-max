<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" :title="title" />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :list="blog.visitor" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart :list="blog.category" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { searchItem, searchBlog } from '@/api/report'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: [],
      title: '访客',
      blog: {}
    }
  },
  created() {
    this.searchItem('statistics')
    this.searchBlog()
  },
  methods: {
    searchItem(key) {
      searchItem({ key }).then(res => {
        this.lineChartData = res
      })
    },
    searchBlog() {
      searchBlog().then(res => {
        this.blog = res
      })
    },
    handleSetLineChartData(type) {
      this.searchItem(type)
      const o = {
        statistics: '访客',
        comment: '评论',
        images: '图片',
        article: '文章'
      }
      this.title = o[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
