/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	upload: (data, options) => request.post('/file/upload', data, options),
	list: (data, options) => request.get('/file', data, options),
	delete: (id) => request.delete('/file/' + id)
}
