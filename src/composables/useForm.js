/**********************************
 * @Author:
 * @LastEditor:
 * @LastEditTime: 2023/12/05 21:22:43
 * @Email:
 *
 **********************************/

import { cloneDeep } from 'lodash-es'

export function useForm(initFormData = {}) {
	const formRef = ref(null)
	const formModel = ref(cloneDeep(initFormData))
	const rules = {
		required: {
			required: true,
			message: '此为必填项',
			trigger: ['blur', 'change']
		}
	}
	const validation = () => {
		return formRef.value?.validate()
	}
	return [formRef, formModel, validation, rules]
}
