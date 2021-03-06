<template>
  <Card shadow v-show="model_value">
    <p slot="title" style="border-left:2px solid #2d8cf0;padding-left: 10px;">
      人员信息
    </p>
    <Form ref="formRef" :rules="ruleForm" :model="form" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="登录账号" prop="user_name">
            <Input :maxlength="20" v-model.trim="form.user_name"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="手机号码" prop="telephone">
            <Input :maxlength="11" v-model.trim="form.telephone"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="登录密码" prop="password">
            <Input :maxlength="20" v-model.trim="form.password" :placeholder="id?'不修改密码就不用重新填写':''"/>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="姓名">
            <Input :maxlength="10" v-model.trim="form.full_name"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="性别">
            <RadioGroup v-model="form.gender">
              <Radio :label="1" border>男</Radio>
              <Radio :label="2" border>女</Radio>
              <Radio :label="0" border>保密</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="角色" prop="role_id">
            <Select v-model="form.role_id" multiple>
              <Option v-for="(item, index) in roleList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="职位" prop="title">
            <Input :maxlength="20" v-model.trim="form.title"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="执法证号" prop="law_num">
            <Input :maxlength="8" v-model.trim="form.law_num"/>
          </FormItem>
        </Col>
        <Col span="8" v-show="id">
          <FormItem label="启用状态">
            <RadioGroup v-model="form.status">
              <Radio :label="0" border>停用</Radio>
              <Radio :label="1" border>启用</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <div style="text-align: center;margin: 16px 0;">
        <Button style="width: 150px" type="default" :loading="submit" @click="cancel()">取消</Button>
        <Button type="primary" style="width: 150px;margin-left: 16px" :loading="submit" @click="save()">保存</Button>
      </div>
    </Form>
    <Spin fix v-if="loading"></Spin>
  </Card>
</template>

<script>
import {
  savePeople,
  getPeopleInfo,
  getPeopleRole
} from '@/api/server'
export default {
  name: 'add-people',
  model: {
    prop: 'model_value',
    event: 'child-change'
  },
  props: {
    model_value: Boolean,
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        if (!this.id) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      } else {
        if (value.length < 6) {
          callback(new Error('密码长度至少 6 位'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      submit: false,
      roleList: [],
      titleList: [],
      form: {
        user_name: '',
        telephone: '',
        password: '',
        full_name: '',
        gender: 1,
        title: '',
        law_num: '',
        role_id: [],
        status: 1
      },
      ruleForm: {
        telephone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    model_value (val) {
      if (val) {
        this.loadData()
      } else {
        this.clearData()
      }
    }
  },
  methods: {
    clearData () {
      // 清空
      for (let n in this.form) {
        if (typeof this.form[n] === 'string') {
          this.form[n] = ''
        } else if (typeof this.form[n] === 'number') {
          this.form[n] = 0
        } else if (typeof this.form[n] === 'object') {
          if (this.form[n] === null) {
            this.form[n] = ''
          } else {
            if (typeof this.form[n].length === 'undefined') {
              this.form[n] = {}
            } else {
              this.form[n] = []
            }
          }
        }
      }
    },
    cancel (res) {
      // 取消
      this.$refs['formRef'].resetFields()
      this.$emit('child-change', false)
      this.$emit('on-complete', res || {})
    },
    save () {
      // 保存
      if (this.submit) return
      this.submit = true
      this.$refs['formRef'].validate((valid) => {
        if (!valid) {
          this.submit = false
          return
        }
        let data = Object.assign({}, this.form)
        data.id = this.id
        data.role_id = data.role_id.join(',')
        savePeople(data).then(res => {
          this.submit = false
          if (this.id) {
            // 编辑成功
            this.cancel({ msg: 'ok' })
          } else {
            // 添加成功
            this.$Modal.confirm({
              title: '成功提示',
              content: '<p>操作成功</p><p>是否继续添加？</p>',
              onOk: () => {
                this.clearData()
              },
              onCancel: () => {
                this.cancel({ msg: 'ok' })
              }
            })
          }
        }).catch(() => {
          this.submit = false
        })
      })
    },
    loadData () {
      // 加载信息
      if (this.id) {
        this.loading = true
        getPeopleInfo(this.id).then(res => {
          this.loading = false
          this.form = Object.assign(this.form, res)
        })
      }
      // 加载角色
      if (!this.roleList.length) {
        getPeopleRole().then(res => {
          this.roleList = res
        })
      }
    }
  }
}
</script>
