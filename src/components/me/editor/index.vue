<template>
	<MdEditor v-if="props.editMode" v-model="text" @onUploadImg="onUploadImg" />
	<MdPreview v-else :modelValue="text"></MdPreview>
</template>

<script setup>
import { ref } from 'vue'
import { MdEditor, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import api from '@/api'
const props = defineProps({
	text: {
		type: String,
		default: ''
	},
	editMode: {
		type: Boolean,
		default: false
	}
})
const text = ref(props.text)
const onUploadImg = async (files, callback) => {
	const res = await Promise.all(
		files.map((file) => {
			return new Promise((rev, rej) => {
				const form = new FormData()
				form.append('file', file)
				form.append('classify', 'editor')
				api
					.upload(form, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					})
					.then((res) => rev(res))
					.catch((error) => rej(error))
			})
		})
	)

	callback(res.map((item) => item.data.url))
}
const getValue = (value) => {
	return text.value ? text.value : ''
}
defineExpose({
	getValue
})
</script>
