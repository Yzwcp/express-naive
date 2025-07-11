/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:22:49
 * @Email:
 *
 **********************************/

export function useModal() {
	const modalRef = ref(null)
	const okLoading = computed({
		get() {
			return modalRef.value?.okLoading
		},
		set(v) {
			if (modalRef.value) {
				modalRef.value.okLoading = v
			}
		}
	})
	return [modalRef, okLoading]
}
