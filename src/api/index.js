/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/04 22:50:38
 * @Email:
 *
 **********************************/

import { request } from '@/utils'

export default {
	// 获取用户信息
	getUser: () => request.get('/user/detail'),
	// 刷新token
	refreshToken: () => request.get('/auth/refresh/token'),
	// 登出
	logout: () => request.post('/auth/logout', {}, { needTip: false }),
	// 切换当前角色
	switchCurrentRole: (role) => request.post(`/auth/current-role/switch/${role}`),
	// 获取角色权限
	getRolePermissions: () => request.get('/sys/permission/getTreeMenuByRole'),
	// 验证菜单路径
	validateMenuPath: (path) => request.get(`/sys/permission/menu/validate?path=${path}`),
	//获取文件列表
	getFileList: (params) => request.get('/sys/file', { params }),
	getFileDirect: (params) => request.get('/sys//file/direct', { params }),
	crateFile: (data) => request.post('/sys/file', data),
	removeFile: (id) => request.delete('/sys/file/' + id, {})
}
