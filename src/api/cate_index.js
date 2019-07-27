// 引入axios
import axios from '@/utils/myaxios.js'
// get用params，put用data
export const getAllCateList = (type) => {
  return axios({
    url: 'categories',
    params: { type }
  })
}
