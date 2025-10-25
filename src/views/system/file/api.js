/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	upload: (data, options) => request.post('/sys/file/upload', data, options),
	list: (data, options) => request.get('/sys/file/list', { params: data }),
	delete: (id) => request.post('/sys/file/remove', { id: id })
}
