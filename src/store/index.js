/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:26:15
 * @Email:
 *
 **********************************/

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function setupStore(app) {
	const pinia = createPinia()
	pinia.use(piniaPluginPersistedstate)
	app.use(pinia)
}

export * from './modules'
