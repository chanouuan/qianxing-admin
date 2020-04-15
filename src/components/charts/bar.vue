<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: {}
    }
  },
  watch: {
    value (val) {
      // 加载中
      let arr = Object.keys(val)
      if (arr.length) {
        this.dom.hideLoading()
        this.setOption()
      }
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    setOption () {
      let xAxisData = Object.keys(this.value)
      let seriesData = Object.values(this.value)
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: seriesData,
          type: 'bar'
        }]
      }
      this.dom.setOption(option)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.setOption()
      this.dom.showLoading({
        text: '加载中',
        color: '#3385ff'
      })
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
