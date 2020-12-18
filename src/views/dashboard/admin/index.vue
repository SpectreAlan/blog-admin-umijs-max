<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :list="blog.browser" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" :title="title" />
        </div>
      </el-col>
    </el-row>
    <el-row class="item">
      <el-switch
        v-model="type"
        active-text="省份分布"
        inactive-text="城市分布"
        :active-value="0"
        :inactive-value="1"
      />
      <city-map :list="cityVisitor" :city="cityPosition" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import CityMap from './components/CityMap'
import { searchItem, searchBlog, searchCity } from '@/api/report'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    CityMap
  },
  data() {
    return {
      lineChartData: [],
      title: '访客',
      blog: {},
      cityPosition: {},
      type: 1,
      city: [],
      cityVisitor: []
    }
  },
  watch: {
    type() {
      this.getCityData()
    }
  },
  created() {
    this.searchItem('statistics')
    this.searchBlog()
    this.searchCity()
  },
  methods: {
    searchItem(key) {
      searchItem({ key }).then(res => {
        this.lineChartData = res
      })
    },
    searchCity() {
      searchCity().then(res => {
        this.city = res
        this.getCityData()
      })
    },
    getCityData() {
      this.cityPosition = {}
      this.cityVisitor = []
      if (this.type) { // 城市分布
        this.city.forEach(k => {
          if (k.n && !k.city_name.includes('省')) {
            this.cityPosition[k.city_name] = [k.x, k.y]
            this.cityVisitor.push({
              name: k.city_name,
              value: k.n
            })
          }
        })
      } else { // 省份分布
        const arr = ['北京市', '上海市', '天津市', '重庆市', '香港', '澳门']
        this.city.forEach(k => {
          if (k.city_name.includes('省') || arr.includes(k.city_name)) {
            this.cityPosition[k.city_name] = [k.x, k.y]
            this.cityVisitor.push({
              name: k.city_name,
              value: k.n
            })
          }
        })
      }
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
  .item{
    background:#fff;
    padding:16px 16px 0;
    margin-bottom:32px;
    .el-switch{
        margin: 10px;
    }
  }
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
