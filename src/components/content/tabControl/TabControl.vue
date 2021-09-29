<template>
<div  class="tab-control">
    <div v-for="(item,index) in titles" 
    :key="index"
    @click="itemClick(index)"
     class="tab-control-item" :class="{active:currentIndex == index}">
        <span>{{item}}</span>
    </div>
</div>
</template>
<script>
import { ref } from '@vue/reactivity';
export default {
    name:"TabControl",
    props:{
        titles:{
            type:Array,
            default(){
                return [];
            }
        }
    },
    setup(props,{emit}){
        let currentIndex = ref(0);
        const itemClick = (index)=>{
            currentIndex.value = index;
            emit('tabClick',index);
        }
        return {
            currentIndex,
            itemClick
        }
    },
    components:{
        
    }
    
}
</script>
<style lang="scss" scoped>
.tab-control {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    background-color:white;
    z-index: 6;

    position: sticky;
    top: 40px;
    .tab-control-item {
        flex: 1;
        span {
            padding:5px;
        }
    }
    .active {
        color: var(--color-tint);
        span {
            
            border-bottom: 3px solid var(--color-tint);
        }
    }
}
</style>