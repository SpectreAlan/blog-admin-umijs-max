<template>
  <div :class="className" :style="{height:height,width:'100%'}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons')
require('echarts/map/js/china')
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    height: {
      type: String,
      default: '800px'
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    city: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    list() {
      if (this.list.length > 0) {
        this.$nextTick(() => {
          this.initChart()
        })
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    convertData(data) {
      const res = []
      for (let i = 0; i < data.length; i++) {
        const geoCoord = this.city[data[i].name]
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          })
        }
      }
      return res
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        backgroundColor: '#404a59',
        title: {
          text: '访客城市分布',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          'confine': true,
          'formatter': (city) => {
            const { name, value } = city.data
            return name + '<br>访客:' + value[2]
          }
        },
        visualMap: {
          type: 'piecewise',
          min: 0,
          max: 300,
          splitNumber: 5,
          color: ['#d94e5d', '#eac736', '#50a3ba'],
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'china',
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#323c48',
              borderColor: '#111'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        },
        series: [
          {
            name: '访客',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: this.convertData(this.list),
            encode: {
              value: 2
            },
            symbolSize: 12,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1
              }
            }
          }
        ]
      })
    }
  }
}
</script>
