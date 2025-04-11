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
	getButtons: ({ parentId }) => request.get(`/sys/permission/button/${parentId}`),
	getComponents: () => axios.get(`${import.meta.env.VITE_PUBLIC_PATH}components.json`),
	addPermission: (data) => request.post('/sys/permission', data),
	savePermission: (id, data) => request.put(`/sys/permission/${id}`, data),
	deletePermission: (id) => request.delete(`/sys/permission/${id}`)
}
