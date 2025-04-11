/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:25:00
 * @Email:
 *
 **********************************/

const baseTitle = import.meta.env.VITE_TITLE

export function createPageTitleGuard(router) {
	router.afterEach((to) => {
		const pageTitle = to.meta?.title
		if (pageTitle) {
			document.title = `${pageTitle} | ${baseTitle}`
		} else {
			document.title = baseTitle
		}
	})
}
