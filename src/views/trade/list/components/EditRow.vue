<script setup>
import { defineProps, ref } from 'vue'
import { NInput, NSelect, NInputNumber } from 'naive-ui'
import { dict, dictKey, getDictLabel } from '@/utils/index.js'
import dayjs from 'dayjs'
import HRender from '@/components/me/render/index.vue'
import { debounce } from 'lodash-es'
import { prop } from 'dom7'

const props = defineProps({
	value: {
		type: [String, Number, Array],
		default: undefined
	},
	type: {
		type: [String, Number],
		default: 'input'
	},
	dictKey: {
		type: String,
		default: ''
	},
	options: {
		type: Array,
		default: () => []
	},
	unit: {
		type: String,
		default: ''
	},
	textClass: {
		type: String,
		default: ''
	},
	render: {
		type: Function
	}
})
const emit = defineEmits(['changeValue'])
const isEdit = ref(false)
const lock = ref(false)
const selectRef = ref()
const inputValue = ref(props.value)

const filterLabel = () => {
	let text = []
	props.options.forEach((item) => {
		if (inputValue.value && inputValue.value?.includes(item.value)) {
			text.push(item.label)
		}
	})
	return text
}
const labelText = computed(() => {
	if (props.type === 'multiple') {
		return filterLabel() || []
	}
})

const handleValue = (v) => {
	isEdit.value = false
	emit('changeValue', inputValue.value)
}
const mouseleave = () => {
	if (lock.value) return
	isEdit.value = false
}
const openSelect = () => {
	isEdit.value = true
	nextTick(() => {
		console.log(selectRef.value)
		selectRef.value.focus()
	})
}
</script>

<template>
	<div class="w-full text-center">
		<template v-if="props.type === 'input'">
			<div @click="openSelect" @mouseleave="mouseleave">
				<div class="w-full cursor-pointer" v-if="!isEdit">
					<span v-if="inputValue" :class="props.textClass">{{ inputValue }}{{ props.unit }}</span>
					<span v-else class="color-gray-400 color-f">请填写</span>
				</div>
				<NInput
					class="w-full"
					placeholder="请填写"
					ref="selectRef"
					size="small"
					v-if="isEdit"
					@focus="lock = true"
					@blur="
						() => {
							lock = false
							mouseleave()
						}
					"
					v-model:value="inputValue"
					@change="handleValue"
					@keyup.enter="() => handleValue(inputValue)"
				/>
			</div>
		</template>
		<template v-else-if="props.type === 'time'">
			<div @mouseleave="mouseleave">
				<div class="w-full cursor-pointer" v-if="!isEdit">
					<span @click="openSelect" v-if="inputValue">{{ dayjs(inputValue).format('YYYY/MM/DD HH:mm') }}</span>
					<span v-else class="color-gray-400">请选择时间</span>
				</div>
				<n-date-picker
					@focus="lock = true"
					@change="handleValue"
					:show="isEdit"
					ref="selectRef"
					:on-update:show="
						(v) => {
							if (!v) {
								lock = false
								mouseleave()
							}
						}
					"
					v-if="isEdit"
					:format="'yyyy/MM/dd HH:mm'"
					v-model:value="inputValue"
					type="datetime"
					clearable
				/>
			</div>
		</template>
		<template v-else-if="props.type === 'select'">
			<div @click="openSelect">
				<div v-if="!isEdit" class="w-full cursor-pointer" @focus="isEdit = true" @blur="isEdit = false">
					<div v-if="props.render">
						<HRender :render="props.render"></HRender>
					</div>
					<span v-else-if="inputValue">{{ getDictLabel(props.dictKey, inputValue) }}</span>
					<span v-else class="color-gray-400">请选择</span>
				</div>
				<NSelect
					show-on-focus
					size="small"
					ref="selectRef"
					placeholder="请选择"
					v-if="isEdit"
					class="w-full"
					v-model:value="inputValue"
					@update:value="handleValue"
					@update:show="
						(v) => {
							if (!v) isEdit = false
						}
					"
					:options="dict[props.dictKey]"
				></NSelect>
			</div>
		</template>
		<template v-else-if="props.type === 'multiple'">
			<div @click="openSelect">
				<div v-if="!isEdit" class="w-full cursor-pointer" @focus="isEdit = true" @blur="isEdit = false">
					<span v-if="labelText.length > 0" class="cursor-pointer">
						<n-tag class="mx-2" size="small" v-for="item in labelText">{{ item }}</n-tag>
					</span>
					<span v-else class="color-gray-400">请选择</span>
				</div>
				<NSelect
					multiple
					show-on-focus
					size="small"
					ref="selectRef"
					placeholder="请选择"
					v-if="isEdit"
					class="w-full"
					v-model:value="inputValue"
					@update:show="
						(v) => {
							if (!v) {
								handleValue(inputValue)
								isEdit = false
							}
						}
					"
					:options="props.options"
				></NSelect>
			</div>
		</template>
		<template v-else-if="props.type === 'select'"> </template>
	</div>
</template>

<style scoped></style>
