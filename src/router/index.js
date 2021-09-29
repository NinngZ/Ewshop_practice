import { createRouter, createWebHistory } from 'vue-router'
import {Notify,Toast} from "vant";
import store from "../store";

const Home = () => import('../views/home/Home.vue');
const Category = () => import('../views/category/Category.vue');
const Detail = () => import('../views/detail/Detail.vue');
const Profile = () => import('../views/profile/Profile.vue');
const Shopcart = () => import('../views/shopcart/Shopcart.vue');
const Register = () => import('../views/profile/Register.vue');
const Login = () => import('../views/profile/Login.vue');
const Address = () => import('../views/profile/Address.vue');
const AddressEdit = () => import('../views/profile/AddressEdit.vue');
const CreateOrder = () => import('../views/order/CreateOrder.vue');
const OrderDetail = () => import('../views/order/OrderDetail.vue');
const Order = () => import('../views/order/Order.vue');

const routes = [
  {
    path: '/',
    name: 'Default',
    component: Home,
    meta:{
      title:'商品兄弟'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      title:'商品兄弟'
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta:{
      title:'商品兄弟-商品分类'
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'商品兄弟-商品详情'
    }
  },
  {
    path: '/shopcart',
    name: 'Shopcart',
    component: Shopcart,
    meta:{
      title:'商品兄弟-购物车',
      isAuthRequired:true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta:{
      title:'商品兄弟-个人中心',
      isAuthRequired:true
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta:{
      title:'商品兄弟-地址管理',
      isAuthRequired:true
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta:{
      title:'商品兄弟-地址编辑',
      isAuthRequired:true
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta:{
      title:'商品兄弟-订单预览',
      isAuthRequired:true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component:Order,
    meta:{
      title:'商品兄弟-订单列表',
      isAuthRequired:true
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta:{
      title:'商品兄弟-订单详情',
      isAuthRequired:true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:'商品兄弟-用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:'商品兄弟-用户登录'
    }
  }

  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
//全局的导航守卫
router.beforeEach((to,from,next)=>{
  //如果没有登录，在这里导航到login
  if(to.meta.isAuthRequired  && store.state.user.isLogin === false){
    Notify('您还未登录，请先登录!');
    next('/login');
  }else {

    next();
  }

  document.title=to.meta.title;
})

export default router
