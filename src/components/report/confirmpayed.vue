<template>
  <Modal :value="model_value" :width="50" :styles="{top:'20px'}" :mask-closable="false"  @on-visible-change="modalChange">
    <p slot="header">
      发送赔偿通知书
    </p>
    <Card style="box-shadow:none" shadow>
      <Form :label-width="100" label-colon>
        <Row>
          <Col span="14">
            <FormItem label="卷宗号">
              <Input v-model="form.archive_num" :maxlength="20" type="text" placeholder="请输入数字格式的卷宗号 (不必填)" clearable/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div style="margin-bottom:10px;color:#576b95;text-align:right;">当事人责任认定：应赔付 {{total_money}} 元</div>
      <Table :columns="columns" :data="persons" border></Table>
    </Card>
    <div slot="footer">
      <Button type="default" style="width: 150px" @click="modalChange(false)">取消</Button>
      <Button type="primary" style="width: 150px" :loading="loading" @click="onConfirm">确定</Button>
    </div>
  </Modal>
</template>

<script>

export default {
  name: 'charge',
  model: {
    prop: 'model_value',
    event: 'child-change'
  },
  props: {
    model_value: Boolean,
    persons: Array,
    total_money: Number
  },
  data () {
    return {
      loading: false,
      form: {},
      columns: [
        {
          title: '当事人',
          key: 'full_name'
        },
        {
          title: '手机号',
          key: 'user_mobile'
        },
        {
          title: '赔偿比例（%）',
          key: 'money',
          render: (h, params) => {
            return h('Input', {
              props: {
                value: this.persons && this.persons.length === 1 ? 100 : '',
                maxlength: 5,
                placeholder: '请输入百分比（0-100）'
              },
              on: {
                input: (val) => {
                  this.inputAmount(params.index, val)
                }
              }
            })
          }
        }
      ]
    }
  },
  methods: {
    modalChange (val) {
      // 关闭
      this.$emit('child-change', val)
      if (val) {
        if (this.persons && this.persons.length === 1) {
          this.persons[0].ratio = 100 // 只有 1 个当事人，赔偿比例默认 100%
        }
      }
    },
    inputAmount (index, val) {
      // 输入赔偿金额
      val = parseFloat(val)
      val = (isNaN(val) || val < 0) ? 0 : val
      this.persons[index].ratio = parseFloat(val.toFixed(2))
    },
    onConfirm () {
      // 确定
      if (!this.persons.length) {
        return this.$Message.error('请先录入当事人')
      }
      let ratio = []
      let data = 0
      this.persons.forEach(n => {
        data += (n.ratio || 0)
        ratio.push({
          id: n.id,
          ratio: (n.ratio || 0)
        })
      })
      if (data !== 100) {
        return this.$Message.error('赔偿总比例应为100%')
      }
      this.$emit('onSuccess', {
        ratio: ratio,
        archive_num: this.form.archive_num
      })
    }
  }
}
</script>

<style scoped>

</style>
