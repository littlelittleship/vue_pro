// 引入axios
import axios from '@/utils/myaxios.js'

// 登录
export const login = (data) => {
  // axios({})返回一个promise对象
  return axios({
    // 请求路由路径
    url: 'login',
    // 请求方式，默认是get
    method: 'post',
    // post方式发送的数据： data:data的简写
    data
  })
}
