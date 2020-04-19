<template>
  <div style="overflow: hidden; position: relative;" >
    <Row :gutter="16">
      <Col span="6" v-for="(infor, i) in cardData" :key="`infor-${i}`" style="height: 120px; margin-bottom: 16px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </Col>
    </Row>
    <Row>
      <Card shadow>
        <chart-line style="height: 310px;" :value="lineData" text="今年案件处置数"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import {
  indexCount
} from '@/api/server'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartLine } from '_c/charts'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartLine
  },
  data () {
    return {
      cardData: [
        { title: '今日报警', icon: 'md-locate', count: 0, color: '#3399FF' },
        { title: '今日隐患', icon: 'md-cash', count: 0, color: '#3399FF' },
        { title: '今日事故', icon: 'md-people', count: 0, color: '#3399FF' },
        { title: '累计案件', icon: 'md-person-add', count: 0, color: '#3399FF' }
      ],
      lineData: []
    }
  },
  created () {
    indexCount().then(res => {
      let cardData = res[0]
      this.cardData.forEach((n, k) => {
        n.count = cardData[k]
      })
      this.lineData = res[1]
    }).catch(() => {})
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
