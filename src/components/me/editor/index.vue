<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
defineOptions({ name: 'editor' })
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const props = defineProps({
	/**
	 * @default default
	 * @options default, simple
	 */
	mode: {
		type: String,
		default: 'default'
	},
	/**
	 * @default 请输入内容...
	 */
	valueHtml: {
		type: String,
		default: ''
	},
	editorStyle: {
		type: Object,
		default: {}
	}
})
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref(props.valueHtml)
const mode = ref('default')
const token = localStorage.getItem('vue-naivue-admin_auth')
// 模拟 ajax 异步获取内容
onMounted(() => {})

const toolbarConfig = {}
const editorConfig = {
	placeholder: '请输入内容...',
	MENU_CONF: {
		uploadImage: {
			server: '/api/file/upload',
			fieldName: 'file',
			meta: {
				classify: 'editor'
			},
			headers: {
				Authorization: 'Bearer ' + JSON.parse(token).accessToken
			}
		}
	}
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value
	if (editor == null) return
	editor.destroy()
})

const handleCreated = (editor) => {
	editorRef.value = editor // 记录 editor 实例，重要！
}
const getValue = () => {
	return editorRef.value.getHtml()
	// 粘贴事件
}
defineExpose({
	getValue
})
</script>

<template>
	<div style="border: 1px solid #ccc">
		<Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
		<Editor
			:style="props.editorStyle"
			v-model="valueHtml"
			:defaultConfig="editorConfig"
			:mode="mode"
			@onCreated="handleCreated"
		/>
	</div>
</template>

<style scoped></style>
