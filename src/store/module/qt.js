import config from '@/config'
import qwebchannel from '@/libs/qwebchannel'
import { Notice } from 'view-design'

export default {
  state: {
    qtDialog: null,
    qtRunning: false,
    lockReconnect: false,
    tt: 0
  },
  mutations: {
    setQtDialog (state, qtDialog) {
      state.qtDialog = qtDialog
    },
    setQtRunning (state, qtRunning) {
      state.qtRunning = qtRunning
    },
    setLockReconnect (state, lockReconnect) {
      state.lockReconnect = lockReconnect
    },
    setTt (state, tt) {
      state.tt = tt
    }
  },
  actions: {
    createQtChannel ({ state, commit, dispatch }, func) {
      // 创建 WebSocket
      let baseUrl = config.qtChannelWebSocketAddr
      let beginTime = (new Date()).getTime()
      Notice.info({
        title: '正在建立连接...',
        duration: 2
      })
      let ws = new WebSocket(baseUrl)
      ws.onclose = () => {
        Notice.error({
          title: '通信连接已关闭',
          duration: 2
        })
        commit('setQtRunning', false)
        commit('setQtDialog', null)
        ws = null
        dispatch('reconnect', func)
      }
      ws.onerror = () => {
        commit('setQtRunning', false)
        commit('setQtDialog', null)
        ws = null
        dispatch('reconnect', func)
      }
      ws.onopen = () => {
        dispatch('heartCheck', ws)
        qwebchannel.QWebChannel(ws, channel => {
          let dialog = channel.objects.dialog
          commit('setQtDialog', dialog)
          commit('setQtRunning', true)
          dispatch('onQtMessage', { ws, func })
          Notice.success({
            title: '系统通信启动（' + parseFloat((new Date().getTime() - beginTime) / 1000).toFixed(2) + 's）',
            duration: 2
          })
        })
      }
    },
    reconnect ({ state, commit, dispatch }, func) {
      // 重连
      if (state.lockReconnect) return
      clearTimeout(state.tt)
      commit('setLockReconnect', true)
      setTimeout(() => {
        dispatch('createQtChannel', func)
        commit('setLockReconnect', false)
      }, 5000)
    },
    heartCheck ({ state, commit, dispatch }, ws) {
      // 心跳检测
      clearTimeout(state.tt)
      let tt = 0
      tt = setTimeout(() => {
        dispatch('sendQtText', { code: 1 }) // 发送心跳包
        tt = setTimeout(() => {
          ws && ws.close() // 30 秒未响应就关闭 websocket 连接
        }, 10000)
        commit('setTt', tt)
      }, 60000)
      commit('setTt', tt)
    },
    onQtMessage ({ state, dispatch }, { ws, func }) {
      // 接收消息
      if (!state.qtRunning) return
      state.qtDialog.sendText.connect(message => {
        try {
          message = JSON.parse(message)
          message.errorcode = 0
        } catch (e) {
          message = {
            data: message,
            errorcode: -1,
            message: e.message
          }
        }
        func(message)
        dispatch('heartCheck', ws)
      })
    },
    sendQtText ({ state }, text) {
      // 发送消息
      if (!state.qtRunning) return
      if (typeof text !== 'string') {
        text = JSON.stringify(text)
      }
      state.qtDialog.receiveText(text)
    },
    sendLoginCmd ({ state, dispatch, rootState }) {
      // 登录
      if (!state.qtRunning) return
      const { user: { clinicInfo } } = rootState
      let text = {
        code: 100,
        data: {
          'hospital_id': clinicInfo.id,
          'hospital_name': clinicInfo.name
        }
      }
      dispatch('sendQtText', text)
    },
    sendBeginVoiceCmd ({ state, dispatch, rootState }) {
      // 开始录音
      if (!state.qtRunning) return
      const { user: { userId, userName } } = rootState
      let text = {
        code: 101,
        data: {
          'user_id': userId,
          'user_name': userName
        }
      }
      dispatch('sendQtText', text)
    },
    sendEndVoiceCmd ({ state, dispatch, rootState }, { order_id }) {
      // 结束录音
      if (!state.qtRunning) return
      const { user: { userId, userName } } = rootState
      let text = {
        code: 102,
        data: {
          'user_id': userId,
          'user_name': userName,
          'order_id': order_id
        }
      }
      dispatch('sendQtText', text)
    },
    sendPrintCmd ({ state, dispatch }, { code, type, print_size, content }) {
      // 打印
      if (!state.qtRunning) return
      let text = {
        code: code, // 300会诊单 301收费单 302会诊号
        data: {
          'type': type, // 1直接打印 2预览打印
          'print_size': print_size, // A4 B5 D57
          'content': content
        }
      }
      dispatch('sendQtText', text)
    },
    sendLoadConfigCmd ({ state, dispatch }) {
      // 发送加载本地配置命令
      if (!state.qtRunning) return
      dispatch('sendQtText', { code: 400 })
    }
  }
}
