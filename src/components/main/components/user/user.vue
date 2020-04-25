<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <span style="vertical-align: middle;">
        <Badge :dot="!!messageUnreadCount">
          <Avatar :src="userAvator"/>
        </Badge>
        <Icon style="vertical-align: middle;" :size="18" type="md-arrow-dropdown"></Icon>
      </span>
      <DropdownMenu slot="list">
        <DropdownItem style="border-bottom: 1px solid #e8eaec"><span style="color: #aaa;">{{ userName }}</span></DropdownItem>
        <DropdownItem name="pwd">修改密码</DropdownItem>
        <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="feedback">问题反馈</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Feedback v-model="feedbackModal" />
  </div>
</template>

<script>
import {
  editPwd
} from '@/api/server'
import './user.less'
import { mapActions } from 'vuex'
import Feedback from '_c/us/feedback'
export default {
  name: 'User',
  components: {
    Feedback
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    },
    userName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      feedbackModal: false,
      newpwd: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      return false
      // this.$router.push({
      //   name: 'message_page'
      // })
    },
    feedback () {
      this.feedbackModal = true
    },
    pwd () {
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              value: '',
              autofocus: true,
              maxlength: 32,
              placeholder: '请输入新密码'
            },
            on: {
              input: (val) => {
                this.newpwd = val
              }
            }
          })
        },
        title: '修改登录密码',
        onOk: () => {
          if (!this.newpwd) {
            return this.$Message.error('密码不能为空')
          }
          editPwd({ password: this.newpwd }).then(res => {
            this.newpwd = ''
            this.$Message.success('密码修改成功')
          }).catch(() => {})
        }
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
        case 'feedback': this.feedback()
          break
        case 'pwd': this.pwd()
          break
      }
    }
  }
}
</script>
