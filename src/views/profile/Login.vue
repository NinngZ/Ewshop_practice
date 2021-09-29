<template>
  <div>
    <NavBar>
      <template v-slot:default>用户登录</template>
    </NavBar>
    <div style="margin-top: 40px">
      <div style="text-align: center;padding-top:30px ">
        <van-image
            width="10rem"
            height="10rem"
            fit="contain"
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
      </div>

      <!--https://img01.yzcdn.cn/vant/cat.jpeg-->
      <van-form @submit="onSubmit">

        <van-field
            v-model="email"
            name="电子邮箱"
            label="电子邮箱"
            placeholder="请输入正确的电子邮箱格式！"
            :rules="[{ required: true, message: '请输入正确的电子邮箱格式！' }]"
        />
        <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            autocomplete="off"
            :rules="[{ required: true, message: '请填写密码' }]"
        />

        <div style="margin: 16px;">
          <div class="link-login" @click="$router.push({path:'/register'})">
            没有账号，立即注册
          </div>
          <van-button round block type="info" color="#44b883" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>

  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import {ref,reactive ,toRefs} from "vue";
import {myLogin} from "network/user.js";
import { Notify,Toast } from 'vant';
import  {useRouter} from 'vue-router';
import {useStore } from 'vuex';
export default {
  name: "Login",
  components:{
    NavBar
  },
  setup(){
    const router = useRouter();
    const store = useStore();
    const userinfo =reactive({
      email:'',
      password:''
    })
    const onSubmit = () => {
      myLogin(userinfo).then(res=>{
        //将token保存到本地 window.localstorage setItem(key,value)  getItem(key)
        window.localStorage.setItem('ewshop_token',res.access_token)
        //在vuex里保存一个 isLogin的状态 临时使用
        store.commit('setIsLogin',true);

        Toast.success('登录成功');
        userinfo.password = '';
        userinfo.email = '';
        setTimeout(()=>{
          router.go(-1);
        },500)

      })
    }
    return {
      ...toRefs(userinfo),
      onSubmit
    }
  }
}
</script>

<style scoped>
.link-login{
  font-size: 14px;
  margin-bottom: 15px;
  color: #42b983;
  display: inline-block;

}
</style>