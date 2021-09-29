import { createStore } from 'vuex'
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state = {
  //封装用户的信息可能有多种，如果只是一个“是否登录”的话，无需外层的user
  user:{
    //每次刷新也能重新去获取token的值来判断是否是登录的状态，否则每次刷新都会重置vuex的状态值
    isLogin:window.localStorage.getItem('ewshop_token') ? true : false
  },
  cartCount:0
};
export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {
  }
})
