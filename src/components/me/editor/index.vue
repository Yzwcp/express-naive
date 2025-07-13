<template>
	<MdEditor v-if="props.editMode" v-model="text" @onUploadImg="onUploadImg" />
	<MdPreview v-else :modelValue="text"></MdPreview>
</template>

<script setup>
import { ref } from 'vue'
import { MdEditor, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import api from '@/api'
import { useAppStore } from '@/store/index.js'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
const { aliyunOssDirect } = useAppStore()
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
const text = ref(props.text || '')
console.log(aliyunOssDirect)
const onUploadImg = async (files, callback) => {
	const res = await Promise.all(
		files.map((file) => {
			return new Promise((rev, rej) => {
				const uuidName = uuidv4(file.name).replaceAll('-', '')
				console.log(uuidName)
				const form = new FormData()
				form.append('policy', aliyunOssDirect.policy)
				form.append('OSSAccessKeyId', aliyunOssDirect.accessid)
				form.append('success_action_status', '200')
				form.append('signature', aliyunOssDirect.signature)
				form.append('key', aliyunOssDirect.key + '/editor/' + uuidName)
				form.append('file', file)
				form.append('name', file.name)
				axios
					.post(aliyunOssDirect.host, form, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					})
					.then((res) => {
						console.log(aliyunOssDirect.host + '/' + aliyunOssDirect.key + '/editor/' + uuidName)
						rev(aliyunOssDirect.host + '/' + aliyunOssDirect.key + '/editor/' + uuidName)
					})
			})
		})
	)

	callback(res.map((item) => item))
}

const getValue = (value) => {
	return text.value ? text.value : ''
}
defineExpose({
	getValue
})
</script>
