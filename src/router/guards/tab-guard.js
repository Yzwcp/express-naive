/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:25:17
 * @Email:
 *
 **********************************/

import { useTabStore } from '@/store'

export const EXCLUDE_TAB = ['/404', '/403', '/login']

export function createTabGuard(router) {
	router.afterEach((to) => {
		if (EXCLUDE_TAB.includes(to.path)) return
		const tabStore = useTabStore()
		const { name, fullPath: path } = to
		const title = to.meta?.title
		const icon = to.meta?.icon
		const keepAlive = to.meta?.keepAlive
		tabStore.addTab({ name, path, title, icon, keepAlive })
	})
}
