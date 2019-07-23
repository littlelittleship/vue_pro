// 这个文件封装与axios相关的所有配置
import axios from 'axios'
// 设置基准路径，根据接口文档
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  var token = localStorage.getItem('itcast_manage_token')
  config.headers['Authorization'] = token
  return config
}, function (error) {
  return Promise.reject(error)
}
)

// 暴露
export default axios
