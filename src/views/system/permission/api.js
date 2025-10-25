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
	getMenuTree: () => request.get('/sys/permission/getTreeByMenuType'),
	getButtons: ({ parentId }) => request.get(`/sys/permission/button`, { params: { parentId } }),
	getComponents: () => axios.get(`${import.meta.env.VITE_PUBLIC_PATH}components.json`),
	addPermission: (data) => request.post('/sys/permission/create', data),
	savePermission: (id, data) => request.post(`/sys/permission/edit`, { id: id, ...data }),
	deletePermission: (id) => request.post(`/sys/permission/remove`, { id: id })
}
