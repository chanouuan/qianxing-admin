import axios from '@/libs/api.request'
import md5 from 'js-md5'

export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password: md5(password)
  }
  return axios.request({
    url: 'adminserver/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'adminserver/getLoginProfile',
    data: {
      token: token
    },
    method: 'post'
  })
}
