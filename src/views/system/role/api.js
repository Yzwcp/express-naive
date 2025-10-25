/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	create: (data) => request.post('/sys/role/create', data),
	read: (params = {}) => request.get('/sys/role/list', { params }),
	update: (data) => request.post(`/sys/role/edit`, data),
	delete: (id) => request.post(`/sys/role/remove`, { id: id }),

	getAllPermissionTree: () => request.get('/sys/permission/getTree'),
	getAllUsers: (params = {}) => request.get('/sys/user/list', { params }),
	addRoleUsers: (roleId, data) => request.post(`/sys/role/users/add/${roleId}`, data),
	removeRoleUsers: (roleId, data) => request.post(`/sys/role/users/remove`, { id: roleId, ...data })
}
