import request from "@/utils/requests";
import { getToken } from "@/utils/token";
let config = {
    headers: {'Content-Type': "application/json"}
};
let config1 = {
    params: {
        tokenValue:getToken(),
    },
};
 


 export function doLogin(admin:String) {
    return request.post<any,ResponseSuccess<{code:string}>>('/user/login',admin,config)
 }

export function dologout(){
    return request.get<any,ResponseSuccess<{code:string}>>('/user/logout',config1)
}

//  export function userInfo(){ // ↓查询用户信息userInfo: () => {
//    return request.get('/user/getAll')
//  }
