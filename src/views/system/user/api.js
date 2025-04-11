/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	create: (data) => request.post('/sys/user', data),
	read: (params = {}) => request.get('/sys/user', { params }),
	setRole: (data) => request.patch(`/sys/user/setRoles`, data),
	update: (id, data) => request.put(`/sys/user/${id}`, data),
	delete: (id) => request.delete(`/sys/user/${id}`),
	resetPwd: (id, data) => request.patch(`/sys/user/password/reset/${id}`, data),

	getAllRoles: () => request.get('/sys/role?enable=1')
}
