<template>
  <div class="order-list-box">
    <NavBar class="nav-bar">
      <template v-slot:default>订单列表</template>
    </NavBar>
    <van-tabs ref="tabs" @click="onChangeTab" class="order-tab">
      <!--如果不设置的话，name属性默认是各自的序列号-->
      <van-tab title="全部" class="tab-item"></van-tab>
      <van-tab title="待付款" class="tab-item"></van-tab>
      <van-tab title="已支付" class="tab-item"></van-tab>
      <van-tab title="发货" class="tab-item"></van-tab>
      <van-tab title="交易完成" class="tab-item"></van-tab>
      <van-tab title="过期" class="tab-item"></van-tab>
    </van-tabs>
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
        <van-list @click="goTo(item.id)" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" @offset="10 "/>
        <div class="order-item-box van-clearfix" v-for="(item,index) in list" :key="index">
          <div class="order-item-header">
            <span style="line-height: 30px">订单号:{{ item.order_no }} <br>创建时间:{{item.created_at}}</span>
          </div>
          <van-card v-for="sub in item.orderDetails.data" :key="sub.id"
              :num="sub.num" :price="sub.goods.price"
                    desc="全场包邮" :title="sub.goods.title" :thumb="sub.goods.cover_url" />
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import {reactive,ref,toRefs,onMounted} from "vue";
import {getOrderList } from "network/order";
import {useRouter,useRoute} from "vue-router";

export default {
  name: "Order",
  setup(){
    /*List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。
    此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
    若数据已全部加载完毕，则直接将 finished 设置成 true 即可。*/
    const router = useRouter();
    const route = useRoute();
    let tabs =ref(null);
    const state = reactive({
      loading:false,
      finished:false,
      refreshing:false,
      list:[],
      page:1,
      totalPage:0,
      status:0
    })
    onMounted(()=>{
      onRefresh();//初始化
    })
    const loadData = () => {
      getOrderList({page:state.page,status:state.status,include:'orderDetails.goods'}).then(res=>{
        //console.log(res);
        //请求的是每一页单独的数据，需要和之前的数据进行拼接
        state.list = state.list.concat(res.data);
        state.loading = false; //在异步加载数据的过程中禁止再次触发加载
        state.totalPage = res.meta.pagination.total_pages;
        //console.log(res.meta.pagination.total_page + '!!!!!!!!!!!!!!');
        state.refreshing = false;
        if (state.page >= state.totalPage){
          state.finished = true;
        }
      })
    }
    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage){
        state.page = state.page + 1 ;
      }
      if (state.refreshing){
        state.list = [];
        //state.refreshing = false;
      }

      loadData();
    }
    const onRefresh = () => {
      //是否处于加载状态，加载状态不触发loading事件
      state.refreshing = true;
      //清空列表数据
      state.finished = false;
      //重新加载数据
      //将loading设置为true，表示处于加载状态
      state.loading = true;
      state.page=1;
      onLoad();

    }
    //tab 切换
    const onChangeTab = (name) => {
      state.status = name;
      onRefresh();
    }
    //重定向到订单详情界面
    const goTo = (id) => {
      router.push({path:'/orderdetail',query:{id}});
    }
    return{
      ...toRefs(state),
      onLoad,
      onRefresh,
      tabs,
      onChangeTab,
      goTo
    }
   },
  components:{
    NavBar
  }
}
</script>

<style scoped lang="scss">
  .order-tab{
    border: 2px solid blue;
    width: 100vw;
    margin-top: 40px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .van-tab{
      display: inline-block;
      background: red;
      border: 1px solid red;
      flex: 20px 1;
      width: 20px;
      line-height: 20px;
    }
  }
  .order-item-box{
    .order-item-header{
      padding-left: 20px;
      text-align: left;
    }
    van-card{
      padding: 20px;
    }
  }
</style>