<template>
<div>
    <NavBar>
    <template v-slot:default>
      购物车 (<span style="color: red">{{$store.state.cartCount}}</span>)
    </template>
    </NavBar>
  <div class="cart-box">
    <div class="cart-body">
      <van-checkbox-group ref="checkboxGroup" @change="groupChange" v-model="result">
        <van-swipe-cell :right-width="50" v-for="(item,index) in list" :key="index">
          <div class="good-item">
            <van-checkbox :name="item.id" />
            <div class="good-img"><img :src="item.goods.cover_url" alt=""></div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{item.goods.title}}</span>
                <span>x{{item.goods.stock}}</span>
              </div>
              <div class="good-bth">
                <div class="price"><small>￥</small>{{item.goods.price}}</div>
                <van-stepper integer :min="1" :max="item.goods.stock" :model-value="item.num" :name="item.id" async-change
                @change="onChange"/>
              </div>
            </div>
          </div>
          <template #right>
            <van-button square
                        icon="delete"
                        type="danger"
                        class="delete-button"
                        @click="deleteGood(item.id)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
      <van-submit-bar class="submit-all" :price="total * 100" @submit="onSubmit" button-text="结算">
      <van-checkbox @click="allCheck" v-model:checked="checkAll">全选</van-checkbox>
    </van-submit-bar>
    <div class="empty" v-if="!list.length">
      <img class="empty-cart" src="~assets/images/guoxue.jpg" alt="空购物车">
      <div class="title">购物车空空如也....</div>
      <van-button round color="#1baeae" block @click="goTo">前往选购</van-button>
    </div>
  </div>
</div>
</template>
<script>
import {ref,reactive,toRefs,onMounted,computed} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {Toast} from "vant";
import NavBar from 'components/common/navbar/NavBar.vue';
import {getCart,deleteCartItem,checkedCart,modifyCart} from "network/cart.js";

export default {
    name:'Shopcart',
    setup(){
      const router = useRouter();
      const store = useStore();
      //创建数据模型，状态
      const state = reactive({
        list:[],
        result:[],   //购物车id数组
        checkAll:true
      });
      //初始化购物车数据
      const init = () => {
        Toast.loading({message:'加载中......',forbidClick:true})
        getCart('include=goods').then(res=>{
          state.list = res.data;
          state.result = res.data.filter(n=>n.is_checked == 1).map(item=>item.id);
          Toast.clear();
        })
      }
      onMounted(()=>{
        init();
      })
      //通过计算属性 计算总价
      const total = computed(()=>{
        let sum = 0;
        state.list.filter(item=>state.result.includes(item.id)).forEach(item=>{
          sum += parseInt(item.num) * parseFloat(item.goods.price);
        })
        return sum;
      })
      //异步改变购物车数量
      const onChange = (value,detail) => {
        Toast.loading({message:'修改中...',forbidClick:true})
        //value即步长组件里面的最新值

        //console.log(detail.name);
        modifyCart(detail.name,{num:value}).then(res=>{
          //此处  将在onMounted中缓存的list的num 也要改
          state.list.forEach(item=>{
            if (item.id == detail.name){
              item.num = value;
            }
          })
          Toast.clear();

        })
      }
      //复选框改变处理事件
      const groupChange = (result) => {
        //改变全选按钮的状态
        if (result.length == state.list.length){
          state.checkAll = true;
        }else {
          state.checkAll = false;
        }
        //result 默认把每次改变后全部的结果传过来，由参数自动接收 格式：Proxy{0:37,1:38}
        //改变缓存中state中的选中状态
        state.result = result;
        //改变数据库表中的选中状态
        checkedCart({cart_ids:result});
      }
      //全选按钮功能
      const allCheck = () => {
        //state.checkAll表示点击之前的结果，!state.checkAll就是全部选中
        if (!state.checkAll){
          state.result = state.list.map(item=>item.id);
          state.checkAll = true;
        }else {
          state.result = [];
          state.checkAll = false;
        }
      }
      //前往首页购物
      const goTo = () => {
        router.push({path:'/home'});
      }
      //删除商品
      const deleteGood = (id) => {
        deleteCartItem(id).then(res=>{
          init();//重新初始化
          store.dispatch('updateCart');//改变vuex中的状态--购物车数量

        })
      }
      //点击 结算 ，生成订单
      const onSubmit = () => {
        if (state.result.length == 0){
          Toast.fail('请选择商品后再进行结算...');
          return;
        }else {
          router.push({path:'/createorder'});
        }
      }
      return {
        ...toRefs(state),
        goTo,
        onChange,
        groupChange,
        allCheck,
        deleteGood,
        total,
        onSubmit
      }
    },
    components:{
        NavBar
    }
    
}
</script>
<style scoped lang="scss">
.cart-box{
  .cart-body{
    margin: 60px 0 100px 0;
    padding-left: 10px;
    .good-item{
      display: flex;
      .good-img{
        img {
          width: 100px;
          height: auto;
        }
      }
      .good-desc{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 20px;
        .good-title {
          display: flex;
          justify-content: space-between;
        }
        .good-bth{
          display: flex;
          justify-content: space-between;
          .price{
            font-size: 16px;
            color: red;
            line-height: 28px;
          }
          .van-icon-delete {
            font-size: 20px;
            margin-top: 4px;
          }
        }
      }
    }
    .delete-button{
      width: 50px;
      height: 100px;
    }
  }
  .empty{
    width: 50%;
    margin: 200px auto 0;
    text-align: center;
    .empty-cart{
      width:150px;
      margin-bottom: 20px;
    }
    .van-icon-smile-o{
      font-size: 50px;
    }
    .title{
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
  .submit-all {
    margin-bottom: 55px;
    .van-checkbox {
      margin-left: 0px;
    }
    .van-submit-bar_text{
      margin-right:10px;
    }
    .van-submit-bar_button{
      background: red;
    }
  }
  .van-checkbox_icon--checked .van-icon {
    background-color: red;
    border-color: red;
  }
}
</style>