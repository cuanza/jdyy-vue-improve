import { ElMessage } from 'element-plus';
// 对axios进行二次封装
import axios from 'axios';
import { getToken } from './token';
import { removeToken } from '@/utils/token/index'
import { useUserInfoStore } from '@/stores/user-info'

// 1. 利用axios对象的方法create，去创建一个axios案例
// 2. requests就是axios
const request = axios.create({
    // 配置对象
    baseURL: "http://localhost:8080", //基础路径，发送请求的时候，路径当中会出现api
    timeout: 60000,   //请求超时的时间60s
})

// 请求拦截器：在发送请求之前，请求拦截器可以检测到，在请求发送之前处理一些事情
request.interceptors.request.use(
    (c) => {
        // const token=sessionStorage.getItem('token')
        if(getToken()){
            c.headers={
                ...c.headers,
                "satoken":getToken(),
            }
        }

        return c;
    }
)
// 响应拦截器：
request.interceptors.response.use(
    //成功的回调函数
    (res) => {
        if(res.data.code==401){
            
            ElMessage.error(res.data.message)
        }
        
        else if(res.data.code!=200){
            ElMessage.error(res.data.msg)
            useUserInfoStore().$reset()
            removeToken()
            //↓用router.push或replace会缓存页面，比如由admin切换到普通用户，普通用户在没刷新页面之前仍能看到admin才有权限的页面
            window.location.href = '/login'
            return Promise.reject(res.data.msg)
        }else if(res.data.msg=='注册成功'){
            ElMessage.success(res.data.msg)
        }else{
            // ElMessage.success(res.data.message)
        return res.data
        }
        
    },
    //失败的回调函数
    (error) => {
        
        
        ElMessage.error(error.response.data.message)
  
        
        return Promise.reject(error.response.data.message);
    }
)

// 对外暴露
export default request
