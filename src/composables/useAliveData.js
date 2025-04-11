/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:22:28
 * @Email:
 *
 **********************************/

const lastDataMap = new Map()
export function useAliveData(initData = {}, key) {
	key = key ?? useRoute().name
	const lastData = lastDataMap.get(key)
	const aliveData = ref(lastData || { ...initData })

	watch(
		aliveData,
		(v) => {
			lastDataMap.set(key, v)
		},
		{ deep: true }
	)

	return {
		aliveData,
		reset() {
			aliveData.value = { ...initData }
			lastDataMap.delete(key)
		}
	}
}
