import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'

// 修改密码
export const editPwd = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/editPwd',
    data: data,
    method: 'post'
  })
}

// 首页统计
export const indexCount = () => {
  return axios.request({
    url: 'adminserver/indexCount',
    data: { token: getToken() },
    method: 'post'
  })
}

// 获取案件列表
export const getReportList = (data, is_export) => {
  data.token = getToken()
  let param = {
    url: 'adminserver/getReportList',
    data: data,
    method: 'post'
  }
  if (is_export) {
    param.data.export = 1
    param.responseType = 'blob'
  }
  return axios.request(param)
}

// 获取案件详情
export const getReportDetail = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/getReportDetail',
    data: data,
    method: 'post'
  })
}

// 转发赔偿通知书
export const reportFile = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/reportFile',
    data: data,
    method: 'post'
  })
}

// 生成卷宗
export const createArchive = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/createArchive',
    data: data,
    method: 'post'
  })
}

// 下载勘验笔录
export const downloaditemnote = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'word/itemnote',
    data: data,
    method: 'post'
  })
}

// 下载赔偿通知书
export const downloadpaynote = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'word/paynote',
    data: data,
    method: 'post'
  })
}

// 下载卷宗
export const downloadallnote = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'word/allnote',
    data: data,
    method: 'post'
  })
}

// 代收现金
export const reportPayCash = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/reportPayCash',
    data: data,
    method: 'post'
  })
}

// 获取角色列表
export const getRoleList = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/getRoleList',
    data: data,
    method: 'post'
  })
}

// 添加角色
export const saveRole = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/saveRole',
    data: data,
    method: 'post'
  })
}

// 查看角色信息
export const viewRole = (id) => {
  return axios.request({
    url: 'adminserver/viewRole',
    params: { id },
    method: 'get'
  })
}

// 查看权限值
export const viewPermissions = () => {
  return axios.request({
    url: 'adminserver/viewPermissions',
    method: 'get'
  })
}

// 获取人员列表
export const getPeopleList = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/getPeopleList',
    data: data,
    method: 'post'
  })
}

// 添加人员
export const savePeople = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/savePeople',
    data: data,
    method: 'post'
  })
}

// 删除人员
export const delPeople = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/delPeople',
    data: data,
    method: 'post'
  })
}

// 获取人员信息
export const getPeopleInfo = (id) => {
  return axios.request({
    url: 'adminserver/getPeopleInfo',
    params: { id },
    method: 'get'
  })
}

// 获取人员角色
export const getPeopleRole = () => {
  return axios.request({
    url: 'adminserver/getPeopleRole',
    data: { token: getToken() },
    method: 'post'
  })
}

// 意见反馈
export const feedback = (data) => {
  data.token = getToken()
  return axios.request({
    url: 'adminserver/feedback',
    data: data,
    method: 'post'
  })
}

// 下载导入模板
export const downloadCsvTemplate = (type) => {
  return axios.request({
    url: 'adminserver/downloadCsvTemplate',
    data: { type: type },
    method: 'post',
    responseType: 'blob'
  })
}
