<template>
  <div class="address-box">
    <NavBar>
      <template v-slot:default>地址管理</template>
    </NavBar>
    <div v-show="list.length == 0"
         style="font-weight: bolder;width: 100%;height: 40px;line-height:40px;margin-top: 300px;text-align: center">
      还没有地址信息，请去添加吧...........
    </div>
    <div class="address-item">
      <van-address-list
        v-model="choseAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="select"
      />
    </div>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import {ref,reactive,onMounted,toRefs} from "vue";
import {getAddressList} from "network/address";
import {useRouter,useRoute} from "vue-router";

export default {
  name: "Address",
  setup(){
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      choseAddressId:'1',
      list:[]
    })
    onMounted(()=>{
      getAddressList().then(res=>{
        if (res.data.length == 0){
          state.list = [];
          return
        }
        state.list = res.data.map(item=>{
          return{
            id:item.id,
            name:item.name,
            tel:item.phone,  //此处list列表里为tel是组件的要求
            address:`${item.province} ${item.city} ${item.county} ${item.address}`,
            isDefault:!!item.is_default  //为了转换成布尔型数据
          }
        })
      })
    })
    const onAdd = () => {
      router.push({path:'/addressedit',query:{type:'add'}});
    }
    const onEdit = (item) => {
      router.push({path:'/addressedit',query:{type:'edit',addressId:item.id}});
    }
    const select = (item) => {
      router.push({path:'/createoder',query:{addressId:item.id}});
    }
    return {
      ...toRefs(state),
      onAdd,
      onEdit,
      select
    }

  },
  components:{
    NavBar
  }
}
</script>

<style scoped lang="scss">
  .address-box {
    height: 300px;
    .van-radio_icon{
      display: none;
    }
    .address-item{
      margin-top: 45px;
      .van-button{
        background: var(--color-tint);
        border-color: var(--color-tint);
      }
    }
  }
  .van-address-list_bottom{
    bottom: 100px !important;
  }
</style>