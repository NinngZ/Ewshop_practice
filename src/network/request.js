import axios from 'axios';
import { Notify,Toast } from 'vant';
import router from "../router";
export function request(config){
    const instance = axios.create({
        baseURL:'https://api.shop.eduwork.cn',
        timeout:50000
    })
    //请求拦截
    instance.interceptors.request.use(config=>{
        //Authorization: Bearer Token
        //如果接口需要认证才可以访问，在此处设置
        const token = window.localStorage.getItem('ewshop_token');
        if (token){
            config.headers.Authorization = 'Bearer ' + token;
        }
        //直接放行
        return config;
    },err=>{
        //错误处理
    })
    //响应拦截
    instance.interceptors.response.use(res=>{
        return res.data ? res.data : res;
    },err=>{
        //统一跳转：如果有需要授权才能访问的接口，统一去login授权
        if (err.response.status == '401'){
            Toast.fail('清先登录!');
            router.push({path:"/login"});
        }
        //如果有错误，在这里处理，显示错误信息
        //console.log(err.response.data.errors[Object.keys(err.response.data.errors)][0]);
        //先用方法获取所有的key：Object.keys(err.response.data.errors)，再返回第一个[0]，最后获取第一个错误信息进行提示
        Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0]);
    })
    return instance(config);

}

