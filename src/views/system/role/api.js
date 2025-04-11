/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	create: (data) => request.post('/sys/role', data),
	read: (params = {}) => request.get('/sys/role', { params }),
	update: (data) => request.put(`/sys/role/${data.id}`, data),
	delete: (id) => request.delete(`/sys/role/${id}`),

	getAllPermissionTree: () => request.get('/sys/permission/getTree'),
	getAllUsers: (params = {}) => request.get('/sys/user', { params }),
	addRoleUsers: (roleId, data) => request.patch(`/sys/role/users/add/${roleId}`, data),
	removeRoleUsers: (roleId, data) => request.patch(`/sys/role/users/remove/${roleId}`, data)
}
