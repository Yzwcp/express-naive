/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils/index.js'

export default {
	create: (data) => request.post('/goods/product', data),
	read: (params = {}) => request.get('/goods/product', { params }),
	update: (data) => request.put(`/goods/product/${data.id}`, data),
	delete: (id) => request.delete(`/goods/user/${id}`),

	setRole: (data) => request.patch(`/sys/user/setRoles`, data),

	resetPwd: (id, data) => request.patch(`/sys/user/password/reset/${id}`, data),
	getAllRoles: () => request.get('/sys/role?enable=1')
}
