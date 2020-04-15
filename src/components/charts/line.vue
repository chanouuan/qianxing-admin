<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLine',
  props: {
    value: Array,
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
      if (val.length) {
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
      let data = []
      for (let n in this.value[1]) {
        data.push({
          name: n,
          type: 'line',
          data: this.value[1][n]
        })
      }
      const option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '12%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.value[0]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: data
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
