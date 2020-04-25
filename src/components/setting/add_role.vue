<template>
  <Card shadow v-show="model_value">
    <p slot="title" style="border-left:2px solid #2d8cf0;padding-left: 10px;">
      角色信息
    </p>
    <Form ref="formRef" :rules="ruleForm" :model="form" :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="角色名称" prop="name">
            <Input :maxlength="20" v-model.trim="form.name"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="描述">
            <Input :maxlength="50" v-model.trim="form.description"/>
          </FormItem>
        </Col>
        <Col v-if="id" span="8">
          <FormItem label="启用状态">
            <RadioGroup v-model="form.status">
              <Radio :label="1" border>启用</Radio>
              <Radio :label="0" border>停用</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem label="角色权限" prop="permission">
            <CheckboxGroup v-model="form.permission">
              <Checkbox style="margin-bottom: 8px;" v-for="item in permissions" :key="item.id" :label="item.id" border>
                {{ item.description }}
              </Checkbox>
            </CheckboxGroup>
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
  viewRole,
  viewPermissions,
  saveRole
} from '@/api/server'
export default {
  name: 'add-role',
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
    return {
      submit: false,
      loading: false,
      permissions: [],
      form: {
        name: '',
        description: '',
        permission: [],
        status: 1
      },
      ruleForm: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        permission: [
          { required: true, type: 'array', min: 1, message: '请选择权限', trigger: 'change' }
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
        data.permission = data.permission.join(',')
        saveRole(data).then(res => {
          this.submit = false
          this.cancel({ msg: 'ok' })
        }).catch(() => {
          this.submit = false
        })
      })
    },
    loadData () {
      // 加载信息
      if (this.id) {
        this.loading = true
        viewRole(this.id).then(res => {
          this.loading = false
          this.form = Object.assign(this.form, res)
        })
      }
      // 加载权限值
      if (!this.permissions.length) {
        viewPermissions().then(res => {
          this.permissions = res
        })
      }
    }
  }
}
</script>
