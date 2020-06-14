import Vue from 'vue'
import Vuex from 'vuex'
import * as storageTools from '@/utils/localStorage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // { token: , refresh_token: }
    // 项目运行时，先去本地存储中获取登录状态
    user: storageTools.getItem('user'),
    // 控制评论的回复组件是否显示
    showReplyList: false,
    currentComment: null
  },
  mutations: {
    // 通过mutation改变状态
    setUser (state, user) {
      state.user = user

      // 把登录状态存储到本地存储中
      storageTools.setItem('user', user)
    },
    setShowReplyList (state, isShow) {
      state.showReplyList = isShow
    },
    setCurrentComment (state, comment) {
      state.currentComment = comment
    }
  },
  actions: {

  }
})
