<template>
<div>
    <NavBar>
    <template v-slot:default>商品分类</template>
    </NavBar>
    <div id="mainbox">
      <div class="ordertab">
        <!--vant标签页组件-->
        <van-tabs v-model="active" @click="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>
      <div>
        <!-- 通过vant组件库中 侧边导航 + 折叠面板实现了需要的UI效果-->

        <van-sidebar class="leftmenu" v-model="activeKey">
          <van-collapse v-model="activeNames" accordion>
            <van-collapse-item v-for="item in categories" :key="item.id + item.name" :title="item.name" :name="item.name">
              <van-sidebar-item
                  v-for="sub in item.children"
                  :key="sub.id"
                  :title="sub.name"
                  @click="getGoods(sub.id)"/>
            </van-collapse-item>
          </van-collapse>

        </van-sidebar>
      </div>
      <div class="goodslist">
        <div class="content">
          <van-card
              v-for="item in showGoods" :key="item.id"
              @click="itemClick(item.id)"
              :num="item.sales"
              :tag="item.comments_count >= 2 ? '畅销' : '一般'"
              :price="item.price"
              :desc="item.updated_at"
              :title="item.title"
              :thumb="item.cover_url"
              :lazy-load="true"

          />

        </div>
      </div>
    </div>
  <BackTop @bTop="bTop"  v-show="isShowBackTop"></BackTop>
</div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import BackTop from 'components/common/backtop/BackTop.vue';
import { getCategory , getCategoryGoods } from "network/category.js";
import {ref, reactive, onMounted, computed, watchEffect, nextTick} from "vue";
import { useRouter } from 'vue-router';
import BScroll from 'better-scroll';

export default {
    name:"Category",
    setup(){
      const router = useRouter();
      let activeKey = ref(0);
      let activeNames = ref(1);
      let categories = ref([]);
      let bscroll = reactive({});
      let active = ref(1);
      let isShowBackTop = ref(false);
      //记录当前排序条件
      let currentOrder = ref('sales');
      //记录当前分类ID
      let currentCid = ref(0);
      //数据模型
      const goods = reactive({
        sales:{page:1,list:[]},
        price:{page:1,list:[]},
        comments_count:{page:1,list:[]}
      });
      const showGoods = computed(()=>{
        return goods[currentOrder.value].list;
      })
      const init = () => {
        getCategoryGoods('sales',currentCid.value).then(res=>{
          goods.sales.list = res.goods.data;
        })
        getCategoryGoods('price',currentCid.value).then(res=>{
          goods.price.list = res.goods.data;
        })
        getCategoryGoods('comments_count',currentCid.value).then(res=>{
          goods.comments_count.list = res.goods.data;
        })

      }
      onMounted(()=>{
        getCategory().then(res=>{
          categories.value = res.categories;
          //console.log(res);
        })
        init();
        //创建BetterScroll对象
        bscroll = new BScroll(document.querySelector('.goodslist'),{
          prodeType:3,
          click:true,//是否允许点击
          pullUpLoad:true//上拉加载更多默认是false
        });
        //触发滚动事件
        bscroll.on('scroll',(position)=>{
          //console.log(position);
          isShowBackTop.value = (-position.y) > 300;
          //console.log(isShowBackTop);
        })
        //上拉加载数据，触发pullingup
        bscroll.on('pullingUp',()=>{
          const  page = goods[currentOrder.value].page + 1;
          getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
            goods[currentOrder.value].list.push(...res.goods.data); //一定要把数据展开后再追加到list里面
            goods[currentOrder.value].page +=1;
          })
          //完成上啦，等数据请求完成，更新数据展示出来
          bscroll.finishPullUp();
          //重新计算高度
          //bscroll.refresh();
          nextTick(()=>{
            bscroll && bscroll.refresh();
          })
          console.log('当前类型：'+ currentOrder.value+'当前页数：'+page);
        })
      })
      //排序选项卡，组件里无需手动传，只要有参数自动接收即可
      const tabClick =(index)=>{
        let orders = ['sales','price','comments_count'];
        currentOrder.value = orders[index];
        getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
          goods[currentOrder.value].list = res.goods.data;
          nextTick(()=>{
            bscroll && bscroll.refresh();
          })
        })

        //console.log(currentCid.value);
        //console.log(currentOrder.value);
      }
      //通过分类得到商品
      const getGoods = (cid) => {
        currentCid.value = cid;
        init();
        /*nextTick(()=>{
          bscroll && bscroll.refresh();
        })*/
        //console.log(currentCid.value);
        //console.log(currentOrder.value);
      }

      //监听任何一个变量
      watchEffect(()=>{
        nextTick(()=>{
          bscroll && bscroll.refresh();
        })
      });
      const bTop = ()=>{
        bscroll.scrollTo(0,0,1000);
      }
      return {
        activeKey,
        categories,
        activeNames,
        active,
        tabClick,
        currentOrder,
        currentCid,
        getGoods,
        goods,
        showGoods,
        bscroll,
        isShowBackTop,
        bTop,
        itemClick:(id)=>{
          return router.push({path:'/detail',query:{id}});
        }
      }
    },
    components:{
        NavBar,
        BackTop
    }
    
}
</script>
<style  scoped lang="scss">
#mainbox {
  margin-top: 40px;
  display: flex;
  .ordertab {
    flex: 1;
    float: right;
    background: red;
    height: 50px;
    z-index: 9;
    position: fixed;
    top: 40px;
    right: 0;
    left: 130px;
  }
  .leftmenu {
    position: fixed;
    top: 90px;
    left: 0;
    background: greenyellow;
    width: 130px;
    height: auto;
  }
  .goodslist {
    flex: 1;
    background: cornflowerblue;
    position: absolute;
    top: 90px;
    left: 130px;
    right: 0;
    height: 100vh;
    padding: 10px;
    text-align: left !important;
    .van-card__title {
      font-size: 15px;
      margin-top: 10px;
    }
    .van-card__desc {
      font-size: 12px;
    }

  }
}

</style>