<template>
  <Card shadow v-show="model_value">
    <Card shadow>
      <p slot="title" class="card-title">
        当事人信息
      </p>
      <Form v-for="(item, index) in form.persons" :key="index" :label-width="100" label-colon>
        <Row>
          <Col span="12">
            <FormItem label="车牌号">
              {{item.plate_num}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="车辆类型">
              {{item.car_type}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="电话">
              {{item.user_mobile}}
            </FormItem>
          </Col>
        </Row>
        <Row v-if="item.full_name">
          <Col span="4">
            <FormItem label="姓名">
              {{item.full_name}}
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="性别">
              {{item.gender}}
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="出生日期">
              {{item.birthday}}
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="身份证">
              {{item.idcard}}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="住址">
              {{item.addr}}
            </FormItem>
          </Col>
        </Row>
        <Row v-if="item.company_name">
          <Col span="6">
            <FormItem label="单位">
              {{item.company_name}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="法人代表">
              {{item.legal_name}}
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="单位地址">
              {{item.company_addr}}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="责任认定">
              {{form.status==1?'未认定':('承担（'+(item.money/form.total_money*100)+'%）'+item.money+'元')}}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card shadow>
      <p slot="title" class="card-title">
        报案信息
      </p>
      <Form :label-width="100" label-colon>
        <Row>
          <Col span="12">
            <FormItem label="桩号">
              {{form.stake_number}}
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="事发地点">
              {{form.address}}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="事发时间">
              {{form.event_time}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="天气">
              {{form.weather}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="事件类型">
              {{form.event_type}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="受伤情况">
              {{form.driver_state}}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="车辆情况">
              {{form.car_state}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="交通情况">
              {{form.traffic_state}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="预计通行">
              {{form.pass_time?form.pass_time+'分钟':''}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="路产情况">
              {{form.is_property?'有路产损失':'无路产损失'}}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card shadow>
      <p slot="title" class="card-title">
        赔（补）偿清单
      </p>
      <Table ref="table" :columns="columns" :data="form.items" :loading="loading" border></Table>
    </Card>
    <Card shadow>
      <p slot="title" class="card-title">
        处置信息
      </p>
      <Form :label-width="100" label-colon>
        <Row>
          <Col span="6">
            <FormItem label="执法单位">
              {{form.group_name}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="执法人员">
              {{form.law_name}}，{{form.colleague_name}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="执法证号">
              {{form.law_lawnum}}，{{form.colleague_lawnum}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="案件状态">
              {{form.status_str}}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="受理时间">
              {{form.create_time}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="交通恢复时间">
              {{form.recover_time}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="勘验时间">
              {{form.check_start_time}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="结案时间">
              {{form.complete_time}}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24" style="overflow:hidden">
            <FormItem label="现场图照">
              <a :href="item.src" v-if="item.src" target="_blank" style="float:left" v-for="(item, index) in form.site_photos" :key="index">
                <img width="200" :src="item.src"/>
              </a>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card shadow>
      <p slot="title" class="card-title">
        付款情况
      </p>
      <Form :label-width="100" label-colon>
        <Row>
          <Col span="6">
            <FormItem label="应赔付金额">
              <span style="color:#e64340">{{form.total_money}}元</span>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="已线上支付">
              {{form.pay}}元
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="已现金支付">
              {{form.cash}}元
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card v-if="form.cash_log.length" shadow>
      <p slot="title" class="card-title">
        现金收款记录
      </p>
      <Table ref="table" :columns="cash_log_columns" :data="form.cash_log" :loading="loading" border></Table>
    </Card>
    <Card v-if="form.status==1||form.status==2" shadow>
      <p slot="title" class="card-title">
        上传附件
      </p>
      <div class="upload-list" v-for="(item, index) in uploadList" :key="index">
          <template v-if="item.status === 'finished'">
              <img :src="item.url||item.src">
              <div class="upload-list-cover">
                  <a :href="item.url||item.src" target="_blank"><Icon type="ios-eye-outline"></Icon></a>
                  <Icon type="ios-trash-outline" @click.native="upRemove(item)"></Icon>
              </div>
          </template>
          <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
      </div>
      <Upload
          style="display: inline-block; width:120px;"
          ref="upload"
          accept="image/*"
          type="drag"
          name="upfile"
          :default-file-list="form.attachment"
          :action="up_action"
          :data="{token: token, report_id: id}"
          :show-upload-list="false"
          :max-size="10000"
          :on-error="upError"
          :on-success="upSuccess"
          :on-exceeded-size="upMaxSize"
          :before-upload="upBeforeUpload"
          >
          <div style="width: 120px;height:120px;line-height: 120px;">
              <Icon type="ios-camera" size="30"></Icon>
          </div>
      </Upload>
    </Card>
    <Card v-else shadow>
      <p slot="title" class="card-title">
        附件
      </p>
      <div class="upload-list" v-for="(item, index) in form.attachment" :key="index">
          <img :src="item.src">
          <div class="upload-list-cover">
              <a :href="item.src" target="_blank"><Icon type="ios-eye-outline"></Icon></a>
          </div>
      </div>
    </Card>
    <div class="con-footer">
      <Button style="width: 150px; margin-right: 16px" type="default" :loading="submit" @click="cancel()">取消</Button>
      <Button v-if="form.status==1&&form.is_property" :type="form.is_load?'primary':'default'" style="width: 150px; margin-right: 16px" :loading="submit" @click="reportFile()">发送赔偿通知书</Button>
      <Button v-if="form.status==2" type="primary" style="width: 150px; margin-right: 16px" @click="goCash()">代收现金</Button>
      <Button v-if="form.status==2" type="primary" style="width: 150px; margin-right: 16px" :loading="submit" @click="downloadpaynote()">预览赔偿通知书</Button>
      <Button v-if="form.status==1||form.status==2" type="primary" style="width: 150px; margin-right: 16px" :loading="submit" @click="downloaditemnote()">预览勘验笔录</Button>
      <Button v-if="form.status==3&&form.archive_num" type="primary" style="width: 150px; margin-right: 16px" :loading="submit" @click="downloadallnote()">下载卷宗</Button>
      <Button v-if="form.status==3&&form.archive_num" type="warning" style="width: 150px; margin-right: 16px" @click="createArchive()">重新生成卷宗</Button>
      <Button v-if="form.status==3&&!form.archive_num" type="primary" style="width: 150px; margin-right: 16px" @click="createArchive()">生成卷宗</Button>
    </div>
    <Spin fix v-if="loading"></Spin>
    <!--浏览文件-->
    <viewpdf v-model="pdfmodal" :src="filesrc"/>
    <confirmpayed v-model="confirmmodal" @onSuccess="confirmPayedSuccess" :total_money="total_money" :persons="form.persons"/>
  </Card>
</template>

<script>
import {
  getReportDetail,
  reportFile,
  reportPayCash,
  downloadallnote,
  downloaditemnote,
  downloadpaynote,
  createArchive,
  rmReportAttachment
} from '@/api/server'
import { getToken } from '@/libs/util'
import viewpdf from '_c/view-pdf/view-pdf'
import confirmpayed from '_c/report/confirmpayed'
export default {
  name: 'detail',
  components: {
    viewpdf,
    confirmpayed
  },
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
      loading: false,
      submit: false,
      up_disabled: false,
      up_action: '',
      token: getToken(),
      pdfmodal: false,
      confirmmodal: false,
      filesrc: '',
      total_money: 0,
      pay: 0,
      cash: 0,
      money: 0,
      archive_num: '',
      uploadList: [],
      form: {
        items: [],
        cash_log: [],
        persons: [],
        attachment: []
      },
      columns: [
        {
          title: '赔（补）偿项目',
          key: 'name'
        },
        {
          title: '单位',
          key: 'unit'
        },
        {
          title: '收费标准（元）',
          key: 'price'
        },
        {
          title: '数量',
          key: 'amount'
        },
        {
          title: '赔偿金额（元）',
          key: 'total_money'
        }
      ],
      cash_log_columns: [
        {
          title: '收款人',
          key: 'user_name'
        },
        {
          title: '收款金额（元）',
          key: 'amount'
        },
        {
          title: '收款时间',
          key: 'create_time'
        }
      ]
    }
  },
  watch: {
    model_value (val) {
      if (val) {
        this.loadData()
      }
    }
  },
  methods: {
    cancel (res) {
      // 取消
      this.$emit('child-change', false)
      this.$emit('on-complete', res || {})
    },
    confirmPayedSuccess (e) {
      // 已填写赔偿比例
      this.confirmmodal = false
      reportFile({
        report_id: this.id,
        ratio: e.ratio,
        archive_num: e.archive_num
      }).then(res => {
        this.$Message.success('发送成功')
        this.cancel({ msg: 'ok' })
      })
    },
    reportFile () {
      // 发送赔偿通知书
      if (!this.form.is_load) {
        return this.$Message.error('当前案件外勤正在处置中，请等待外勤处置完成！')
      }
      this.confirmmodal = true
    },
    createArchive () {
      // 生成卷宗
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              value: this.archive_num,
              autofocus: true,
              maxlength: 6,
              placeholder: '请输入卷宗号'
            },
            on: {
              input: (val) => {
                this.archive_num = val
              }
            }
          })
        },
        title: '请输入数字格式的卷宗号 (*必填)',
        onOk: () => {
          if (!this.archive_num) {
            return this.$Message.error('卷宗号不能为空')
          }
          createArchive({ report_id: this.id, archive_num: this.archive_num }).then(res => {
            this.$Message.success('卷宗生成成功')
            this.cancel({ msg: 'ok' })
          })
        }
      })
    },
    goCash () {
      // 代收现金
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              value: '',
              autofocus: true,
              maxlength: 6,
              placeholder: '请输入现金收款金额（元）'
            },
            on: {
              input: (val) => {
                this.money = val
              }
            }
          })
        },
        title: '现金收款不超过 ' + (this.total_money - this.pay - this.cash) + ' 元',
        onOk: () => {
          this.money = parseFloat(this.money)
          if (isNaN(this.money) || this.money < 0) {
            return this.$Message.error('金额不能小于0')
          }
          if (this.money > (this.total_money - this.pay - this.cash)) {
            return this.$Message.error('金额不能大于 ' + (this.total_money - this.pay - this.cash) + ' 元')
          }
          reportPayCash({ report_id: this.id, money: this.money }).then(res => {
            this.$Message.success('已收款 ' + this.money + ' 元')
            this.cancel({ msg: 'ok' })
          })
        }
      })
    },
    downloadpaynote () {
      // 下载赔偿通知书
      if (this.submit) {
        return
      }
      this.submit = true
      downloadpaynote({ report_id: this.id }).then(res => {
        this.submit = false
        if (~res.url.indexOf('pdf')) {
          this.pdfmodal = true
          this.filesrc = res.url
        } else {
          let link = document.createElement('a')
          link.href = res.url
          link.click()
          link = null
        }
      }).catch(() => {
        this.submit = false
      })
    },
    downloadallnote () {
      // 下载卷宗
      if (this.submit) {
        return
      }
      this.submit = true
      downloadallnote({ report_id: this.id }).then(res => {
        this.submit = false
        if (~res.url.indexOf('pdf')) {
          this.pdfmodal = true
          this.filesrc = res.url
        } else {
          let link = document.createElement('a')
          link.href = res.url
          link.click()
          link = null
        }
      }).catch(() => {
        this.submit = false
      })
    },
    downloaditemnote () {
      // 下载勘验笔录
      if (this.submit) {
        return
      }
      this.submit = true
      downloaditemnote({ report_id: this.id }).then(res => {
        this.submit = false
        if (~res.url.indexOf('pdf')) {
          this.pdfmodal = true
          this.filesrc = res.url
        } else {
          let link = document.createElement('a')
          link.href = res.url
          link.click()
          link = null
        }
      }).catch(() => {
        this.submit = false
      })
    },
    loadData () {
      // 加载信息
      if (this.id) {
        this.submit = false
        this.loading = true
        getReportDetail({ report_id: this.id }).then(res => {
          this.loading = false
          this.form = res
          this.total_money = res.total_money
          this.pay = res.pay
          this.cash = res.cash
          this.money = 0
          this.archive_num = res.archive_num
          setTimeout(() => {
            if (this.$refs.upload) {
              this.uploadList = this.$refs.upload.fileList
            }
          })
        })
      }
    },

    upRemove (file) {
      // 删除上传文件
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该附件？',
        onOk: () => {
          rmReportAttachment({
            id: file.id,
            report_id: this.id
          }).then(res => {
            const fileList = this.$refs.upload.fileList
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
          })
        }
      })
    },
    upSuccess (response, file) {
      // 上传成功
      this.up_disabled = false
      if (!response || response.errorcode !== 0) {
        this.$Modal.error({
          title: '错误提示',
          content: response.message
        })
        return
      }
      this.$Message.success('上传成功')
      file.id = response.data.id
      file.url = response.data.url
      file.name = response.data.name
    },
    upError (error, file) {
      // 上传失败
      this.up_disabled = false
      this.$Modal.error({
        title: '错误提示',
        content: '文件 ' + file.name + '上传失败' + (error instanceof Error ? error.message : error)
      })
    },
    upMaxSize (file) {
      // 上传大小限制
      this.up_disabled = false
      this.$Modal.error({
        title: '错误提示',
        content: '文件 ' + file.name + '太大，最大上传 10 M'
      })
    },
    upBeforeUpload () {
      // 开始上传
      if (this.up_disabled) {
        return false
      }
      this.up_disabled = true
      return true
    }
  },
  created () {
    // 上传地址
    this.up_action = process.env.NODE_ENV === 'development' ? this.$config.baseUrl.dev : this.$config.baseUrl.pro
    this.up_action += '/adminserver/reportAttachment'
  }
}
</script>

<style scoped>
  .card-title {
    border-left: 2px solid #2d8cf0;
    padding-left: 10px;
  }
  .con-footer {
    text-align: center;
    margin: 30px 0 16px 0;
    left: 0;
    background-color: #fff;
    width: 100%;
  }
  .upload-list{
      display: inline-block;
      width: 120px;
      height: 120px;
      text-align: center;
      line-height: 120px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-right: 10px;
  }
  .upload-list img{
      width: 100%;
      height: 100%;
  }
  .upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
  }
  .upload-list:hover .upload-list-cover{
      display: block;
  }
  .upload-list-cover i{
      color: #fff;
      font-size: 30px;
      cursor: pointer;
      margin: 0 10px;
  }
</style>
