/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:28:30
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	toggleRole: (data) => request.post('/auth/role/toggle', data),
	login: (data) => request.post('/auth/loginByAccount', data, { needToken: false }),
	getUser: () => request.get('/user/detail')
}
