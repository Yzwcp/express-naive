<script setup>
import { defineProps, ref } from 'vue'
import { NInput, NSelect } from 'naive-ui'
import { dict, dictKey, getDictLabel } from '@/utils/index.js'
const props = defineProps({
	value: {
		type: String,
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
const emit = defineEmits(['onValue'])
const isEdit = ref(false)
const lock = ref(false)
const inputValue = ref(props.value)
const handleValue = (v) => {
	inputValue.value = v
	isEdit.value = false
	emit('changeValue', v)
}
const mouseleave = () => {
	if (lock.value) {
		return
	}
	isEdit.value = false
}
</script>

<template>
	<div class="w-full text-center">
		<template v-if="props.type === 'input'">
			<div @mouseenter="isEdit = true" @mouseleave="mouseleave">
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
					:value="inputValue"
					@update:value="(e) => (inputValue = e)"
					@keyup.enter="() => handleValue(inputValue)"
				/>
			</div>
		</template>
		<template v-else-if="props.type === 'time'">
			<div @mouseenter="isEdit = true" @mouseleave="mouseleave">
				<div class="w-full cursor-pointer" v-if="!isEdit">
					<span v-if="inputValue">{{ inputValue }}</span>
					<span v-else class="color-gray-400">请选择时间</span>
				</div>
				<n-date-picker
					v-if="isEdit"
					:format="'yyyy/MM/dd HH:mm'"
					v-model:value="inputValue"
					type="datetime"
					clearable
				/>
			</div>
		</template>
		<template v-else-if="props.type === 'select'">
			<div @click="isEdit = true">
				<div v-if="!isEdit" class="w-full cursor-pointer" @focus="isEdit = true" @blur="isEdit = false">
					<span v-if="inputValue">{{ getDictLabel(props.dictKey, inputValue) }}</span>
					<span v-else class="color-gray-400">请选择</span>
				</div>
				<NSelect
					placeholder="请选择"
					v-if="isEdit"
					class="w-full"
					@update:value="(e) => handleValue(e)"
					:value="inputValue"
					:options="dict[props.dictKey]"
				></NSelect>
			</div>
		</template>
	</div>
</template>

<style scoped></style>
