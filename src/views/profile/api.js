/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:30:03
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	changePassword: (data) => request.post('/user/restPassword', data),
	updateProfile: (data) => request.patch(`/user/profile/${data.id}`, data)
}
