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
