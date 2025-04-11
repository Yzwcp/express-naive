/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:24:53
 * @Email:
 *
 **********************************/

export function createPageLoadingGuard(router) {
	router.beforeEach(() => {
		$loadingBar.start()
	})

	router.afterEach(() => {
		setTimeout(() => {
			$loadingBar.finish()
		}, 200)
	})

	router.onError(() => {
		$loadingBar.error()
	})
}
