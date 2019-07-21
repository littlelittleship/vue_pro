// 这个文件封装与axios相关的所有配置
import axios from 'axios'
// 设置基准路径，根据接口文档
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 暴露
export default axios
