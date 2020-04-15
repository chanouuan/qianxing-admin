<template>
  <Modal id="feedback" :value="model_value" draggable @on-visible-change="modalChange">
    <p slot="header" style="color: #666">问题反馈</p>
    <Form ref="formRef" :model="form" :rules="ruleValidate" :show-message="false" :label-width="60">
      <FormItem label="内容" prop="content">
          <Input maxlength="200" v-model.trim="form.content" placeholder="请输入问题内容"></Input>
      </FormItem>
      <FormItem label="截图" style="margin-bottom: 0">
        <img width="200" v-show="form.screen_capture" :src="form.screen_capture" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" style="width: 100px" :loading="submit" @click="commit">提交</Button>
      <Button type="default" style="width: 100px" :loading="submit" @click="reset">重置</Button>
    </div>
  </Modal>
</template>

<script>
import {
  feedback
} from '@/api/server'
import html2canvas from 'html2canvas'
export default {
  model: {
    prop: 'model_value',
    event: 'child-change'
  },
  props: {
    model_value: Boolean
  },
  data () {
    return {
      submit: false,
      t: null,
      form: {
        content: null,
        screen_capture: null
      },
      ruleValidate: {
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    modalChange (val) {
      // 关闭
      this.$emit('child-change', val)
      clearTimeout(this.t)
      if (val) {
        this.reset()
      } else {
        this.form.content = null
        this.form.screen_capture = null
      }
    },
    commit () {
      this.$refs['formRef'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.submit = true
        feedback(this.form).then(res => {
          this.submit = false
          this.modalChange(false)
          this.$Message.success('内容已提交，感谢您的反馈！')
        }).catch(err => {
          this.submit = false
          this.$Message.error(err)
        })
      })
    },
    reset () {
      this.$refs['formRef'].resetFields()
      this.toImg()
    },
    toImg () {
      this.submit = true
      this.t = setTimeout(() => {
        html2canvas(document.body, {
          ignoreElements: element => {
            if (element.id === 'feedback') return true
          }
        }).then(canvas => {
          this.submit = false
          this.form.screen_capture = canvas.toDataURL()
        }).catch(err => {
          this.submit = false
          this.$Message.error(err)
        })
      }, 1000)
    }
  }
}
</script>
