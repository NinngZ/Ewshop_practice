<template>
  <div class="order-detail-box">
    <NavBar class="nav-bar">
      <template v-slot:default>订单详情</template>
    </NavBar>
    <div class="order-status">
      <div class="status-item">
        <label>订单状态:</label>
        <span>{{ statusString }}</span>
      </div>
      <div class="status-item">
        <label>订单编号：</label>
        <span>{{ detail.order_no }}</span>
      </div>
      <div class="status-item">
        <label>下单时间：</label>
        <span>{{ detail.created_at }}</span>
      </div>
      <van-button v-if="detail.status == 1" @click="showPayFn" style="margin-bottom: 10px" color="#1baeae" block>去支付</van-button>
      <van-button v-if="detail.status == 2" @click="handleConfirmOrder" block>确认订单</van-button>

    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额:</label>
        <span>￥{{ total  }}</span>
      </div>
      <div class="price-item">
        <label>配送方式:</label>
        <span>普通快递</span>
      </div>
    </div>
    <van-card v-for="item in detail.orderDetails.data" :key="item.id"
        :num="item.num" :price="item.price" desc="全场包邮" :title="item.goods.title" :thumb="item.goods.cover_url"/>

    <div style="width: 100%;height: 50px">

    </div>
    <van-popup v-model:show="showPay" position="bottom" :style="{height:'40%'}">
      <div :style="{width:'90%',margin:'0 auto',padding:'50px 0'}">
        <van-grid :border="false" :column-num="2">
          <van-grid-item text="支付宝">
            支付宝二维码 <br>
            <van-image width="150" height="150" :src="aliyun"></van-image>
          </van-grid-item>
          <van-grid-item text="微信支付">
            微信支付二维码 <br>
            <van-image width="150" height="150" :src="wechat"></van-image>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>

  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import {useRoute,useRouter} from 'vue-router';
import {reactive,toRefs,onMounted,computed} from "vue";
import {Toast,Dialog} from "vant";
import {getOrderDetail,confirmOrder,payOrder,payOrderStatue,viewExpress} from "network/order";

export default {
  name: "OrderDetail",
  setup(){
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      orderNo:'',    //订单ID
      detail:{
        orderDetails:{
          data:[]
        }
      },
      showPay:false,
      aliyun:'',
      wechat:''
    })
    const init = () => {
      const {id} = route.query;
      state.orderNo = id;
      getOrderDetail(id).then(res=>{
        state.detail = res;
      })
    }
    onMounted(()=>{
      Toast.loading({message:'加载中...',forbidClick:true});
      init();
      Toast.clear();
    })
    //定义一个计算属性，来显示订单的状态
    const statusString = computed(()=>{
      let status = ['','已下单','已支付','等待发货','确认收货','已过期'];
      return status[state.detail.status];
    })
    //定义一个计算属性，来显示订单的总价
    const total = computed(()=>{
      let sum = 0;
      state.detail.orderDetails.data.forEach(item=>{
        sum+= parseInt(item.num) * parseFloat(item.price);
      })
      return sum;
    })
    const showPayFn = () => {
      state.showPay = true;
      //获取支付宝和微信支付的二维码
      payOrder(state.orderNo,{type:'aliyun'}).then(res=>{
        state.aliyun = res.qr_code_url;
        state.wechat = res.qr_code_url
      })
      const timer = setInterval(()=>{
        payOrderStatue(state.orderNo).then(res=>{
          if (res == '2'){
            state.showPay = false;
            clearInterval(timer);
            router.push({path:'/orderdetail',query:{id:state.orderNo}});
          }
          /*if(!state.showPay){
            clearInterval(timer);
          }*/
        })
      },2000)
    }
    const handleConfirmOrder = () => {
      Dialog.confirm({title:'是否确认订单'}).then(()=>{
        confirmOrder(state.orderNo).then(res=>{
          //if (res.status_code == 204){
            Toast('确认成功');
            init();

        })
      })
    }
    const close = () => {
      Dialog.close();
    }
    return {
      ...toRefs(state),
      statusString,
      total,
      showPayFn,
      handleConfirmOrder,
      close
    }
  },
  components:{
    NavBar
  }
}
</script>

<style scoped lang="scss">
  .order-detail-box{
    text-align: left;
    background: #f7f7f7;
    .order-status{
      background: #fff;
      margin-top: 44px;
      padding: 20px;
      font-size: 15px;
      .status-item{
        margin-bottom: 10px;
        label{
          color: #999;
        }
        span{

        }
      }
    }
    .order-price{
      text-align: left;
      background: #f7f7f7;
      padding: 10px 20px;
      .price-item{
        margin-top: 20px;
      }
    }
  }
</style>