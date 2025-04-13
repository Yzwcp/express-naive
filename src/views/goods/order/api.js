/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils/index.js'

export default {
	create: (data) => request.post('/goods/order', data),
	read: (params = {}) => request.get('/goods/order', { params }),
	update: (data) => request.put(`/goods/order/${data.id}`, data),
	delete: (id) => request.delete(`/goods/user/${id}`),

	alipay: (data) => request.post('/goods/order/alipay/page', data)
}
