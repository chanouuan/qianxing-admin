<template>
  <div>
    <Row :gutter="16">
      <Col span="6">
        <Card :padding="0">
          <div class="dw-info">
            单位人员导入
          </div>
          <div class="dw-btn">
            <Button style="color:#2d8cf0; border-color:#2d8cf0" @click="downloadTemplate('user')">下载模板</Button>
          </div>
          <div class="dw-btn">
            <Upload :on-exceeded-size="upMaxSize" :before-upload="upBefore" :on-success="upSuccess" :on-error="upError" name="upfile" :data="{token:token,type:'user'}" accept=".csv" :format="['csv']" :max-size="10000" :action="action">
              <Button :disabled="disabled" style="color:#2d8cf0; border-color:#2d8cf0;">上传数据</Button>
            </Upload>
          </div>
        </Card>
      </Col>
    </Row>
    <Alert style="margin-top: 20px">
      <p>温馨提示：</p>
      <p>1. <b>第一步</b>：下载相关模板，按照模板格式填写数据， <b>第二步</b>：上传填写好的数据。</p>
    </Alert>
  </div>
</template>

<script>
import {
  downloadCsvTemplate
} from '@/api/server'
import { getToken } from '@/libs/util'
export default {
  data () {
    return {
      action: '',
      token: getToken(),
      disabled: false
    }
  },
  methods: {
    upBefore (file) {
      // 开始上传
      this.disabled = true
      return true
    },
    upMaxSize (file) {
      // 上传大小限制
      this.disabled = false
      this.$Modal.error({
        title: '错误提示',
        content: '文件 ' + file.name + '太大，最大上传 10 M'
      })
    },
    upSuccess (response, file) {
      // 上传成功
      this.disabled = false
      if (!response || response.errorcode !== 0) {
        this.$Modal.error({
          title: '错误提示',
          content: response.message
        })
        return
      }
      this.$Modal.success({
        title: '上传成功',
        content: response.message
      })
    },
    upError (error, file) {
      // 上传失败
      this.disabled = false
      this.$Modal.error({
        title: '错误提示',
        content: '文件 ' + file.name + '上传失败' + (error instanceof Error ? error.message : error)
      })
    },
    downloadTemplate (type) {
      // 下载模板
      downloadCsvTemplate(type).then(res => {
        let link = document.createElement('a')
        link.download = '模板.csv'
        link.href = URL.createObjectURL(new Blob([res.data]))
        link.click()
        URL.revokeObjectURL(link.href)
        link = null
      }).catch(() => {})
    }
  },
  created () {
    this.action = process.env.NODE_ENV === 'development' ? this.$config.baseUrl.dev : this.$config.baseUrl.pro
    this.action += '/adminserver/importCsv'
  }
}
</script>

<style scoped>
.dw-info {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.dw-btn {
  text-align: center;
  margin-bottom: 16px;
}
</style>
