<template>
  <div>
    <NavBar>
    <template v-slot:default>商品详情:{{id}}</template>
    </NavBar>
    <van-image style="margin-top: 50px"
        width="100%"
        lazy-load
        :src="detail.cover_url"
    />
    <van-card style="text-align: left"
        :num="detail.stock"
        :price="detail.price"
        :desc="detail.description"
        :title="detail.title"

    >
      <template #tags>
        <van-tag plain type="danger">新书</van-tag>
        <van-tag plain type="danger">推荐</van-tag>
      </template>
      <template #footer>
        <van-button type="warning" @click="handleAddCart">加入购物车</van-button>
        <van-button type="danger" @click="goToCart">立即购买</van-button>
      </template>
    </van-card>
    <van-tabs v-model="active">
      <van-tab title="详情">
        <div class="content" v-html="detail.details">

        </div>
      </van-tab>
      <van-tab title="评价">
        <div v-for="item in detail.comments">
          {{item}}
        </div>
      </van-tab>
      <van-tab title="相关图书">
        <GoodsList :goods="like_goods"></GoodsList>
      </van-tab>
    </van-tabs>
  </div>

</template>
<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import GoodsList from "components/content/goods/GoodsList";
import { getDetail } from 'network/detail.js';
import {addCart} from 'network/cart.js';
import { useRoute,useRouter } from "vue-router";
import {useStore} from 'vuex';
import { ref , onMounted,reactive,toRefs} from "vue";
import {Toast} from "vant";

export default {
    name:'Detail',
    setup(){
        let active = ref(0);
        const route = useRoute();
        const router = useRouter();
        const store = useStore();
        let id = ref(0);
        let book = reactive({
          detail:{},
          like_goods:[]
        });
        id.value = route.query.id;
        onMounted(()=>{
          getDetail(id.value).then(res=>{
              book.detail = res.goods;
              book.like_goods = res.like_goods;
          })
        })
        //添加购物车
        const handleAddCart = () => {
          addCart({goods_id:book.detail.id,num:1}).then(res=>{
            if (res.status == '201' || res.status == '204'){
              Toast.success('添加成功.');
              //设置store中cartCount
              store.dispatch('updateCart');
            }
          })
        }
        //立即购买
        const goToCart = () => {
          addCart({goods_id:book.detail.id,num:1}).then(res=>{
            if (res.status == '201' || res.status == '204'){
              Toast.success('添加成功,显示购物车.');
              //设置store中cartCount
              store.dispatch('updateCart');
              router.push({path:'/shopcart'});
            }
          })
        }
        return {
            id,
          ...toRefs(book),
          active,
          handleAddCart,
          goToCart
        }
    },
    components:{
        NavBar,
        GoodsList
    }
    
}
</script>
<style scoped lang="scss">
  .content {
    max-width: 100%;
    padding: 10px;

  }

</style>