<template>
  <div class="create-order">
    <NavBar class="nav-bar">
      <template v-slot:default>订单预览</template>
    </NavBar>
    <div class="address-wrap">
      <div class="name" @click="goTo">
        <span>{{address.name}}</span>
        <span>{{address.phone}}</span>
      </div>
      <div class="address">
        {{address.province}} {{address.city}} {{address.county}} {{address.address}}
      </div>
      <van-icon class="arrow" name="arrow" />
    </div>
    <div class="good">
      <div class="good-item" v-for="(item,index) in cartList" :key="index">
        <div class="good-img"><img v-lazy="item.goods.cover_url" alt=""></div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{item.goods.title}}</span>
            <span>x{{item.num}}</span>
          </div>
          <div class="good-bth">
            <div class="price"><small>￥</small>{{item.goods.price}}</div>
          </div>
        </div>
      </div>
    </div>
    <van-submit-bar class="submit-all"
                    :price="total * 100"
                    button-text="生成订单"
                    @submit="handleCreateOrder">
      商品金额
    </van-submit-bar>
    <!--弹出层组件  生成订单的时候显示，选择支付方式-->
    <van-popup closeable
               :close-on-click-overlay="false"
               v-model:show="showPay"
               position="bottom"
               :style="{height:'40%'}"
               @close="close">

      <van-grid :border="false" :column-num="2">
        <van-grid-item>
          支付宝二维码 <br>
          <van-image width="150" height="150" :src="aliyun" />
        </van-grid-item>
        <van-grid-item>
          微信支付二维码 <br>
          <van-image width="150" height="150" :src="wechat" />
        </van-grid-item>
      </van-grid>
      <!--<div :style="{width:'90%',margin:'0 auto',padding:'50px 0' }">
        <van-button :style="{marginBottom:'10px'}" color="#1989fa" block>
          支付宝
        </van-button>
        <van-button color="#4fc08d" block>
          微信支付
        </van-button>
      </div>-->
    </van-popup>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import {reactive,onMounted,toRefs,computed} from "vue";
import {getOrderPreview,createOrder,payOrder,payOrderStatue} from "network/order";
import {Toast} from "vant";
import {useRouter,useRoute} from 'vue-router';
import {useStore} from 'vuex';
export default {
  name: "CreateOrder",
  setup(){
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      cartList: [],
      address: {},
      showPay:false,
      orderNo:'',
      aliyun:'',
      wechat:''
    })

    const init = () => {
      Toast.loading({message: '加载中...', forbidClick: true});
      getOrderPreview().then(res=>{
        //获取默认的地址信息
        let address = res.address.filter(n => n.is_default == '1');
        if (address.length == 0){
          state.address = {
            address: '还没有设置默认地址，请选择或者填写地址信息...'
          }
        }else {
          state.address = address[0];
        }

        //获取购物车商品的信息  res.carts.goods 就是购物车里的商品信息
        state.cartList = res.carts;
        Toast.clear();
      })
    }
    onMounted(() => {
      init()

    })
    const goTo = () => {
      router.push({path: '/address'})
    }
    let timer = null;
    const handleCreateOrder = () => {
      const params = {
        address_id : state.address.id
      }
      //创建订单
      createOrder(params).then(res=>{
        Toast('创建订单成功');
        //更新购物车红点数量
        store.dispatch('updateCart');
        state.showPay = true;
        //res会返回订单id
        state.orderNo = res.id;
        console.log(state.orderNo);
        //获取支付宝和微信支付的二维码
        payOrder(state.orderNo,{type:'aliyun'}).then(res=>{
          state.aliyun = res.qr_code_url;
          state.wechat = res.qr_code_url
        })
        /*payOrder(state.orderNo,{type:'wechat'}).then(res=>{
          state.wechat = res.qr_code_url;
        })*/
        //轮询查看，支付成功后跳转到订单详情界面
        timer = setInterval(()=>{
          payOrderStatue(state.orderNo).then(res=>{
            if (res == '2'){
              clearInterval(timer);
              router.push({path:'/orderdetail',query:{id:state.orderNo}});
            }
          })
        },2000)

      })
    }
    //关闭支付弹出框后，重定向到订单详情界面
    const close = () => {
      clearInterval(timer);
      router.push({path:'/orderdetail',query:{id:state.orderNo}})
    }
    const total = computed(()=>{
      let sum = 0;
      state.cartList.forEach(item=>{
        sum += parseInt(item.num) * parseFloat(item.goods.price);
      })
      return sum;
    })
    return {
      ...toRefs(state),
      goTo,
      handleCreateOrder,
      close,
      total
    }
  },
  components:{
    NavBar
  }
}
</script>

<style scoped lang="scss">
  .create-order{
    background: #f9f9f9;
    .address-wrap{
      text-align: left;
      margin-bottom: 20px;
      background: #fff;
      position: relative;
      margin-top: 44px;
      font-size: 14px;
      padding: 15px;
      color:#222333;
      .name,.adress{
        margin: 10px 0;
      }
      .arrow{
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
      }
      &::before{
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 2px;
        background: repeating-linear-gradient(-45deg,#ff6c6c 0,#ff6c6c  20%,transparent 0,transparent 25%,#1989fa 0);
        background-size:80px;
      }

    }
    .good{
      margin-bottom: 120px;
    }
    .good-item{
      padding: 10px;
      background: #fff;
      display: flex;
      .good-img{
        img{
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
      .good-title{
        display: flex;
        justify-content: space-between;
      }
        .good-btn{
          display: flex;
          justify-content: space-between;
          .price{
            font-size: 16px;
            color: red;
            line-height: 28px;
          }
          .van-icon-delete{
            font-size: 20px;
            margin-top: 4px;
          }
        }
      }
    }

  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 10px 50px 0;
    border-top: 1px solod #e9e9e9;

    > div {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin: 10px 0;
      font-size: 14px;

      span:nth-child(2) {
        color: red;
        font-size: 18px;
      }
    }

    .pay-btn {
      position: fixed;
      bottom: 7px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
      }
    }
  }
  .submit-all{
    margin-bottom: 50px;
    z-index: 9 !important;
  }
</style>