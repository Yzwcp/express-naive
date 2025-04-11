/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	create: (data) => request.post('/user', data),
	read: (params = {}) => request.get('/user', { params }),
	setRole: (data) => request.patch(`/user/setRoles`, data),
	update: (id, data) => request.put(`/user/${id}`, data),
	delete: (id) => request.delete(`/user/${id}`),
	resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),

	getAllRoles: () => request.get('/role?enable=1')
}
