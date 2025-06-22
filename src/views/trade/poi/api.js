/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils/index.js'

export default {
	create: (data) => request.post('/trade/model', data),
	read: (params = {}) => request.get('/trade/model', { params }),
	modelAnalysis: (params = {}) => request.get('/trade/modelAnalysis', { params }),
	update: (data) => request.put(`/trade/model/${data.id}`, data),
	delete: (id) => request.delete(`/trade/model/${id}`)
}
