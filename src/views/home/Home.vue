<template>
<div id="home">
    <NavBar>
    <template v-slot:default>图书商城</template>
    </NavBar>
    <TabControl v-show="isTabFixed" @tabClick="tabClick" :titles="['畅销','新书','精选']"></TabControl>
    <div class="wrapper">
        <div class="content">
            <div ref="banref">
                <!--<div class="banners">
                    <img src="~assets/images/feet.jpg" alt="">
                </div>-->
              <home-swiper  :banners="banners"></home-swiper>
                <RecommendView :recommends="recommends"></RecommendView>
            </div>
            <TabControl @tabClick="tabClick" :titles="['畅销','新书','精选']"></TabControl>
            <GoodsList :goods="showGoods"></GoodsList>
        </div>
        <BackTop @bTop="bTop"  v-show="isShowBackTop"></BackTop>
    </div>
    
   

</div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import RecommendView from './ChildComps/RecommendView.vue';
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
import BackTop from 'components/common/backtop/BackTop.vue';
import HomeSwiper from "./ChildComps/HomeSwiper";
import { ref,reactive,onMounted,computed ,watchEffect ,nextTick} from "vue";
import { getHomeAllData , getHomeGoods } from "network/home.js";
import BScroll from 'better-scroll';

export default {
    name:"Home",
    setup(){
        let isTabFixed = ref(false);
        let isShowBackTop = ref(false);        
        //临时变量 const temid = ref(0);
        let banref = ref(null);
        const recommends = ref([]);
        //商品列表数据模型
        const goods = reactive({
            sales:{page:1,list:[]},
            new:{page:1,list:[]},
            recommend:{page:1,list:[]}
        });
        const currentType = ref('sales');
        const showGoods = computed(()=>{
            return goods[currentType.value].list
        })

        let bscroll = reactive({});
        let  banners = ref([]);
        onMounted(()=>{
            getHomeAllData().then(res=>{
                //console.log(res.goods);
                recommends.value = res.goods.data;
                banners.value = res.slides;
            })

            getHomeGoods('sales').then(res=>{
                goods.sales.list = res.goods.data;
            })
            getHomeGoods('new').then(res=>{
                goods.new.list = res.goods.data;
            })
            getHomeGoods('recommend').then(res=>{
                goods.recommend.list = res.goods.data;
            })
            //创建BetterScroll对象
            bscroll = new BScroll(document.querySelector('.wrapper'),{
                prodeType:3,
                click:true,//是否允许点击
                pullUpLoad:true//上拉加载更多默认是false
            });
            //触发滚动事件
            bscroll.on('scroll',(position)=>{
                //console.log(position);
                isShowBackTop.value =isTabFixed.value = (-position.y) > banref.value.offsetHeight;
                //console.log(isShowBackTop);
            })
            //上拉加载数据，触发pullingup
            bscroll.on('pullingUp',()=>{
                const page = goods[currentType.value].page +1;
                getHomeGoods(currentType.value,page).then((res)=>{
                    //此处需要将获取到的数据通过扩展运算符结构再赋值
                    goods[currentType.value].list.push(...res.goods.data);
                    goods[currentType.value].page += 1;
                })
                //完成上啦，等数据请求完成，更新数据展示出来
                bscroll.finishPullUp();
                //重新计算高度
                bscroll.refresh();
                console.log('当前类型：'+ currentType.value+'当前页数：'+page);
            })
            
        })
        


        const tabClick = (index)=>{
            
            let types = ['sales','new','recommend'];
            currentType.value = types[index];
            //切换页面后重新计算高度
            nextTick(()=>{
                bscroll && bscroll.refresh();
            })
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
            recommends,
            tabClick,
            goods,
            showGoods,
            isTabFixed,
            banref,
            isShowBackTop,
            bTop,
            banners
        }
    },
    components:{
        NavBar,
        RecommendView,
        TabControl,
        GoodsList,
        BackTop,
        HomeSwiper
    }
}
</script>
<style lang="scss" scoped>
#home {
    height: 100vh;
    position: relative;
}
.banners {
    width: 100%;
    background-color: rgb(136, 127, 255);
    height: 200px;
    img {
    
        width: 100%;
        height: 100%;
        margin: 0px;
    }
}
.wrapper{
    position: absolute;
    top: 40px;
    bottom: 50px;
    left: 0px;
    right: 0px;
    overflow: hidden;
    
}
</style>