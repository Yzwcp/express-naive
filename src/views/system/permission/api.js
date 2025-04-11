/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2024/04/01 15:52:04
 * @Email:
 *
 **********************************/

import { request } from '@/utils'
import axios from 'axios'

export default {
	getMenuTree: () => request.get('/permission/getTreeByMenuType'),
	getButtons: ({ parentId }) => request.get(`/permission/button/${parentId}`),
	getComponents: () => axios.get(`${import.meta.env.VITE_PUBLIC_PATH}components.json`),
	addPermission: (data) => request.post('/permission', data),
	savePermission: (id, data) => request.put(`/permission/${id}`, data),
	deletePermission: (id) => request.delete(`permission/${id}`)
}
