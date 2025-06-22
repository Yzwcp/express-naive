<template>
	<!-- 空渲染 -->
	<template v-if="!render && !$slots.default"></template>

	<!-- 插槽优先 -->
	<template v-else-if="$slots.default">
		<slot v-bind="data || {}"></slot>
	</template>

	<!-- 函数式渲染 -->
	<component v-else-if="typeof render === 'function'" :is="() => render(data)" />

	<!-- 字符串渲染 -->
	<span v-else-if="typeof render === 'string'">
		{{ render }}
	</span>

	<!-- 直接渲染组件 -->
	<component v-else :is="render" v-bind="{ ...componentProps, ...data }" />
</template>

<script setup>
import { h } from 'vue'
defineOptions({ name: 'HRender' })
const props = defineProps({
	/**
	 * 渲染内容，可以是：
	 * 1. 渲染函数: (data) => VNode
	 * 2. 组件对象
	 * 3. 字符串
	 */
	render: [Function, Object, String],

	/**
	 * 传递给渲染函数/组件的数据
	 */
	data: {
		type: Object,
		default: () => ({})
	},

	/**
	 * 当渲染组件时传递的props
	 */
	componentProps: {
		type: Object,
		default: () => ({})
	}
})
</script>
