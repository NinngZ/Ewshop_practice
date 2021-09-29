import {request} from './request';
//注册
export function myRegister(data){
    return request({
        url:'/api/auth/register',
        method:'post',
        data
    })
}
//登录操作
export function myLogin(data){
    return request({
        url:'/api/auth/login',
        method:'post',
        data
    })
}
//登出账号
export function mylogout(data){
    return request({
        url:'/api/auth/logout',
        method:'post'
    })
}
//得到用户信息
export function getUser(){
    return request({
        url:'/api/user'
    })
}
