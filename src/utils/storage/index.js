/**********************************
 * @FilePath: index.js
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/04 22:46:07
 * @Email:
 *
 **********************************/

import { createStorage } from './storage'

const prefixKey = 'vue-naive-admin_'

export function createLocalStorage(option = {}) {
	return createStorage({
		prefixKey: option.prefixKey || '',
		storage: localStorage
	})
}

export function createSessionStorage(option = {}) {
	return createStorage({
		prefixKey: option.prefixKey || '',
		storage: sessionStorage
	})
}

export const lStorage = createLocalStorage({ prefixKey })

export const sStorage = createSessionStorage({ prefixKey })
