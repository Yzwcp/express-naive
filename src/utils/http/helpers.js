/**********************************
 * @FilePath: helpers.js
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/04 22:46:22
 * @Email:
 *
 **********************************/

import { useAuthStore } from '@/store'

let isConfirming = false

export function resolveResError(code, data, needTip = true) {
	let message = data?.message
	const errors = data?.errors || ''
	if (Array.isArray(errors)) {
		message += `${errors.join(',')}`
	} else {
		message += `${errors || ''}`
	}
	switch (code) {
		case 401:
			if (isConfirming || !needTip) return
			isConfirming = true
			$dialog.confirm({
				title: '提示',
				type: 'info',
				content: '登录已过期，是否重新登录？',
				confirm() {
					useAuthStore().logout()
					window.$message?.success('已退出登录')
					isConfirming = false
				},
				cancel() {
					isConfirming = false
				}
			})
			return false
		case 11007:
		case 11008:
			if (isConfirming || !needTip) return
			isConfirming = true
			$dialog.confirm({
				title: '提示',
				type: 'info',
				content: `${message}，是否重新登录？`,
				confirm() {
					useAuthStore().logout()
					window.$message?.success('已退出登录')
					isConfirming = false
				},
				cancel() {
					isConfirming = false
				}
			})
			return false
		case 403:
			message = '请求被拒绝'
			break
		case 404:
			message = '请求资源或接口不存在'
			break
		case 500:
			break
		default:
			message = message ?? `【${code}】: 未知异常!`
			break
	}
	needTip && window.$message?.error(message)
	return message
}
