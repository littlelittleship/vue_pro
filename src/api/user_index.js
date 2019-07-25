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
// 获取所有用户数据
export const getAllUserList = (params) => {
  return axios({
    url: 'users',
    // get方法用params
    params
  })
}

export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    // post方法用data
    data
  })
}

export const delUserById = (id) => {
  return axios({
    url: `users/${id}`,
    // delete是用拼接参数方式传递的
    method: 'delete'
  })
}

export const editUser = (data) => {
  return axios({
    // 每次都没写s，注意是users
    url: `users/${data.id}`,
    method: 'put',
    data: { email: data.email, mobile: data.mobile }
  })
}

export const updateUserState = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}

export const grantUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}
