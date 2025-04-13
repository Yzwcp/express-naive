/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils/index.js'

export default {
	create: (data) => request.post('/goods/sku', data),
	read: (params = {}) => request.get('/goods/sku', { params }),
	update: (data) => request.put(`/goods/sku/${data.id}`, data),
	delete: (id) => request.delete(`/goods/sku/${id}`)
}
