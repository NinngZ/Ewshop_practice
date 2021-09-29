<template>
    <div class="nav-bar">
        <div class="left" @click="goback"><slot name="left">
            <img src="~assets/images/left.png" alt="左箭头">
            </slot></div>
        <div class="center"><slot></slot></div>
        <div class="right"><slot name="right"></slot></div>
    </div>
</template>
<script>
import { useRouter } from 'vue-router';
export default {
    name:"NavBar",
    setup(){
        const router = useRouter();
        const goback = ()=>{
            router.go(-1);
        }
        return {
            goback
        }
    }
    
}
</script>
<style lang="scss" scoped>
.nav-bar {
    display: flex;
    background-color: var(--color-tint);
    color: #FFFFFF;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    
    .left, .right{
        width: 60px;
    }
    .left img{
        width: 40px;
        padding: 10px;
        margin: 0px;
    }
    .center {
            
            flex: 1;
    }
}
</style>