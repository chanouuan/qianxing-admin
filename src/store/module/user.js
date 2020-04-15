import {
  login,
  getUserInfo
} from '@/api/user'

import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: 0,
    avatorImgPath: '',
    token: getToken(),
    access: [],
    hasGetInfo: false,
    groupInfo: {},
    unreadCount: 0
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath || require('../../assets/images/avatar.png')
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setGroupInfo (state, groupInfo) {
      state.groupInfo = groupInfo
    }
  },
  getters: {
    checkLocalChargeAccess: (state) => {
      // 检查收费、退费权限
      return state.access.some(n => ~['ANY', 'localCharge'].indexOf(n))
    },
    checkAddStockAccess: (state) => {
      // 检查库房管理权限
      return state.access.some(n => ~['ANY', 'addStock'].indexOf(n))
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          if (!res.token) {
            reject(new Error('登录失败！'))
          } else {
            commit('setAvator', res.avatar)
            commit('setUserId', res.user_id)
            commit('setUserName', res.nick_name)
            commit('setToken', res.token)
            resolve()
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
        commit('setAccess', [])
        localStorage.clear()
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          res.permission = res.permission || []
          let s = res.permission.join('').length
          if (s * 2 + s % 10 + 127 !== res.s) {
            commit('setToken', '')
            commit('setAccess', [])
            reject(new Error('参数获取失败'))
          } else {
            commit('setAvator', res.avatar)
            commit('setUserName', res.nick_name)
            commit('setUserId', res.id)
            commit('setAccess', res.permission)
            commit('setHasGetInfo', true)
            commit('setGroupInfo', res.group_info)
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
