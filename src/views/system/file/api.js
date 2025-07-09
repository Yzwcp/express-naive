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
	list: (data, options) => request.get('/sys/file', { params: data }),
	delete: (id) => request.delete('/sys/file/' + id)
}
