<template>
<div class="goods">
    <GoodsListItem v-for="item in goods"
    :product = "item"
    :key="item">

    </GoodsListItem>
    
    
</div>
</template>
<script>
import GoodsListItem from "./GoodsListItem.vue";
export default {
    name:'GoodsList',
    props:{
        goods:{
            type:Array,
            default(){
                return [];
            }
        }
    },
    components:{
        GoodsListItem
    }
    
}
</script>
<style lang="scss" scoped>
    .goods {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding:10px 0px 5px;
        background-color: burlywood;
    }
</style>