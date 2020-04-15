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
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo
  },
  methods: {
    //
  },
  data () {
    return {
      cardData: [
        { title: '今日报警', icon: 'md-locate', count: 2, color: '#3399FF' },
        { title: '今日隐患', icon: 'md-cash', count: 4, color: '#3399FF' },
        { title: '今日事故', icon: 'md-people', count: 1, color: '#3399FF' },
        { title: '累计案件', icon: 'md-person-add', count: 53, color: '#3399FF' }
      ]
    }
  },
  created () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
