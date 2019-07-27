// 引入axios
import axios from '@/utils/myaxios.js'

export const getAllGoodsList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
