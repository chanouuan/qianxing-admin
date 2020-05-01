<template>
  <div>
    <!-- 列表 -->
    <Card shadow v-show="!detailPage">
      <Row>
        <Col span="24">
          <Form inline>
            <FormItem>
              <Input style="width: 150px" v-model="search.law_name" :maxlength="20" type="text" placeholder="执法人员姓名/手机" clearable/>
            </FormItem>
            <FormItem>
              <Input style="width: 150px" v-model="search.user_name" :maxlength="20" type="text" placeholder="当事人姓名/手机" clearable/>
            </FormItem>
            <FormItem>
              <Select style="width: 150px; text-align: left;" v-model="search.status" placeholder="案件状态" clearable>
                <Option value="1">受理中</Option>
                <Option value="2">待收款</Option>
                <Option value="3">已结案</Option>
                <Option value="-3">已撤销</Option>
              </Select>
            </FormItem>
            <FormItem>
              <DatePicker style="width: 200px" v-model="search.date_range" type="daterange" :options="dateOption" placeholder="受理时间"></DatePicker>
            </FormItem>
            <FormItem>
              <Button @click="searched" type="primary" icon="ios-search">搜索</Button>
              <Button style="margin-left: 8px;" :loading="exporting" @click="exportCsv" type="primary" icon="ios-download-outline">导出</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Table :columns="columns" :data="rows" :loading="loading" border></Table>
      <div style="margin-top: 16px;overflow: hidden;">
        <div style="float: right;">
          <Page show-total :page-size="pageSize" :current.sync="current" :total="totalCount" @on-change="changePage"/>
        </div>
      </div>
    </Card>

    <!-- 详情 -->
    <detailpage v-model="detailPage" :id="selectId" @on-complete="onComplete"></detailpage>
  </div>
</template>

<script>
import { getReportList, downloadallnote } from '@/api/server'
import detailpage from '_c/report/detail'
export default {
  components: {
    detailpage
  },
  data () {
    return {
      loading: false,
      exporting: false,
      detailPage: false,
      selectId: 0,
      totalCount: 0,
      pageSize: 5,
      current: 1,
      search: {
        law_name: '',
        user_name: '',
        status: '',
        date_range: []
      },
      dateOption: {
        shortcuts: [
          {
            text: '今日',
            value () {
              return [new Date(), new Date()]
            }
          },
          {
            text: '本周',
            value () {
              const now = new Date()
              return [new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1), now]
            }
          },
          {
            text: '本月',
            value () {
              const now = new Date()
              return [new Date(now.getFullYear(), now.getMonth(), 1), now]
            }
          },
          {
            text: '上月',
            value () {
              const now = new Date()
              return [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 1)]
            }
          }
        ]
      },
      columns: [
        {
          title: '当事人',
          key: 'full_name',
          render: (h, params) => {
            if (!params.row.full_name) {
              return h('span', { style: { color: '#ccc' } }, '待确认')
            }
            return h('span', params.row.full_name)
          }
        },
        {
          title: '手机号',
          key: 'user_mobile'
        },
        {
          title: '事发地点',
          key: 'address'
        },
        {
          title: '车牌号',
          key: 'plate_num'
        },
        {
          title: '已付款',
          key: 'pay',
          render: (h, params) => {
            return h('span', params.row.pay + params.row.cash)
          }
        },
        {
          title: '应付款',
          key: 'total_money'
        },
        {
          title: '执法人员',
          key: 'law_name'
        },
        {
          title: '受理时间',
          key: 'create_time'
        },
        {
          title: '状态',
          key: 'status_str',
          render: (h, params) => {
            let color = '#333'
            if (params.row.status === 1) {
              color = '#576b95'
            } else if (params.row.status === 2) {
              color = '#e64340'
            } else if (params.row.status === 3) {
              color = '#19be6b'
            } else if (params.row.status === -3) {
              color = '#ed4014'
            }
            return h('span', { style: { color: color } }, params.row.status_str)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center',
          render: (h, params) => {
            let load = params.row.status === 2 || (params.row.status === 1 && params.row.is_load)
            let action = [
              h('Button', {
                props: {
                  type: 'default',
                  size: 'small'
                },
                style: {
                  color: load ? '#2d8cf0' : '#576b95',
                  borderColor: load ? '#2d8cf0' : '#576b95'
                },
                on: {
                  click: () => {
                    this.detail(params.index)
                  }
                }
              }, load ? '处置' : '查看')
            ]
            if (params.row.status === 3 && params.row.archive_num) {
              action.push(h('Button', {
                props: {
                  type: 'default',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px',
                  color: '#576b95',
                  borderColor: '#576b95'
                },
                on: {
                  click: () => {
                    this.downloadfile(params.index)
                  }
                }
              }, '下载卷宗'))
            }
            return h('div', action)
          }
        }
      ],
      rows: []
    }
  },
  methods: {
    loadList (data) {
      // 获取列表
      if (this.loading) return
      this.loading = true
      data = data || {}
      data = Object.assign(data, this.search)
      data.date_range = null
      if (this.search.date_range && this.search.date_range.length && this.search.date_range[0] && this.search.date_range[1]) {
        data.start_time = this.search.date_range[0]
        data.end_time = this.search.date_range[1]
        data.start_time = data.start_time.getFullYear() + '-' + (data.start_time.getMonth() + 1) + '-' + data.start_time.getDate()
        data.end_time = data.end_time.getFullYear() + '-' + (data.end_time.getMonth() + 1) + '-' + data.end_time.getDate() + ' 23:59:59'
      }
      if (!data.page) this.current = 1
      getReportList(data).then(res => {
        this.loading = false
        this.totalCount = res.total_count
        this.pageSize = res.page_size
        this.rows = res.list
      }).catch(() => {
        this.loading = false
      })
    },
    exportCsv () {
      // 导出
      if (this.exporting) return
      this.exporting = true
      let data = {}
      data = Object.assign(data, this.search)
      data.date_range = null
      if (this.search.date_range && this.search.date_range.length && this.search.date_range[0] && this.search.date_range[1]) {
        data.start_time = this.search.date_range[0]
        data.end_time = this.search.date_range[1]
        data.start_time = data.start_time.getFullYear() + '-' + (data.start_time.getMonth() + 1) + '-' + data.start_time.getDate()
        data.end_time = data.end_time.getFullYear() + '-' + (data.end_time.getMonth() + 1) + '-' + data.end_time.getDate() + ' 23:59:59'
      }
      getReportList(data, true).then(res => {
        this.exporting = false
        let link = document.createElement('a')
        link.download = '案件列表.csv'
        link.href = URL.createObjectURL(new Blob([res.data]))
        link.click()
        URL.revokeObjectURL(link.href)
        link = null
      }).catch(() => {
        this.exporting = false
      })
    },
    searched () {
      // 搜索
      this.loadList()
    },
    changePage (page) {
      // 换页
      this.loadList({ page })
    },
    detail (index) {
      // 查看详情
      this.selectId = this.rows[index].id
      this.detailPage = true
    },
    downloadfile (index) {
      // 下载卷宗
      let id = this.selectId = this.rows[index].id
      downloadallnote({ report_id: id }).then(res => {
        let link = document.createElement('a')
        link.href = res.url
        link.click()
        link = null
      })
    },
    onComplete (res) {
      // 处置完成回调
      if (res.msg === 'ok') {
        this.loadList({ page: this.current })
      }
    }
  },
  created () {
    this.loadList()
  }
}
</script>
