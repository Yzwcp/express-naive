/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils/index.js'

export default {
	create: (data) => request.post('/trade/diary', data),
	read: (params = {}) => request.get('/trade/diary', { params }),
	update: (data) => request.put(`/trade/diary/${data.id}`, data),
	delete: (id) => request.delete(`/trade/diary/${id}`)
}
