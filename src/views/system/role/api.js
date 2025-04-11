/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	create: (data) => request.post('/role', data),
	read: (params = {}) => request.get('/role', { params }),
	update: (data) => request.put(`/role/${data.id}`, data),
	delete: (id) => request.delete(`/role/${id}`),

	getAllPermissionTree: () => request.get('/permission/getTree'),
	getAllUsers: (params = {}) => request.get('/user', { params }),
	addRoleUsers: (roleId, data) => request.patch(`/role/users/add/${roleId}`, data),
	removeRoleUsers: (roleId, data) => request.patch(`/role/users/remove/${roleId}`, data)
}
