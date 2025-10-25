/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	create: (data) => request.post('/sys/user/create', data),
	read: (params = {}) => request.get('/sys/user/list', { params }),
	setRole: (data) => request.post(`/sys/role/setRoles`, data),
	update: (id, data) => request.post(`/sys/user/${id}`, data),
	delete: (id) => request.post(`/sys/user/remove`, { id: id }),
	resetPwd: (id, data) => request.post(`/sys/user/restPassword`, data),

	getAllRoles: () => request.get('/sys/role/list?enable=1')
}
