<script setup>
import { defineProps, ref } from 'vue'
import { NInput, NSelect, NInputNumber } from 'naive-ui'
import { dict, dictKey, getDictLabel } from '@/utils/index.js'
import dayjs from 'dayjs'
const props = defineProps({
	value: {
		type: [String, Number],
		default: undefined
	},
	type: {
		type: [String, Number],
		default: 'input'
	},
	dictKey: {
		type: String,
		default: ''
	}
})
const emit = defineEmits(['changeValue'])
const isEdit = ref(false)
const lock = ref(false)
const selectRef = ref()
const inputValue = ref(props.value)
const handleValue = (v) => {
	isEdit.value = false
	emit('changeValue', inputValue.value)
}
const mouseleave = () => {
	if (lock.value) {
		return
	}
	isEdit.value = false
}
const openSelect = () => {
	isEdit.value = true
	nextTick(() => {
		selectRef.value.focus()
	})
}
</script>

<template>
	<div class="w-full text-center">
		<template v-if="props.type === 'input'">
			<div @mouseover="isEdit = true" @mouseleave="mouseleave">
				<div class="w-full cursor-pointer" v-if="!isEdit">
					<span v-if="inputValue">{{ inputValue }}</span>
					<span v-else class="color-gray-400">请填写</span>
				</div>
				<NInput
					class="w-full"
					placeholder="请填写"
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
			<div @mouseenter="isEdit = true" @mouseleave="mouseleave">
				<div class="w-full cursor-pointer" v-if="!isEdit">
					<span v-if="inputValue">{{ dayjs(inputValue).format('YYYY/MM/DD HH:mm') }}</span>
					<span v-else class="color-gray-400">请选择时间</span>
				</div>
				<n-date-picker
					@focus="lock = true"
					@change="handleValue"
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
					<span v-if="inputValue">{{ getDictLabel(props.dictKey, inputValue) }}</span>
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
		<template v-else-if="props.type === 'select'"> </template>
	</div>
</template>

<style scoped></style>
