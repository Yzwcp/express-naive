/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	upload: (data, options) => request.post('/file/upload', data, options)
}
