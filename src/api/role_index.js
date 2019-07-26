// 引入axios
import axios from '@/utils/myaxios.js'

export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

export const delRightById = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

export const grantRightById = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}

export const addrole = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}

export const delRoleById = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}

export const editrole = (data) => {
  return axios({
    url: `roles/${data.id}`,
    method: 'put',
    data: { roleName: data.roleName, roleDesc: data.roleDesc }
  })
}
