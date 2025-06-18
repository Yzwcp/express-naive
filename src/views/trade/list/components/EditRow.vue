<script setup>
import { defineProps, ref } from 'vue'
import { NInput, NSelect } from 'naive-ui'
import { dict, dictKey, getDictLabel } from '@/utils/index.js'
const props = defineProps({
	value: {
		type: String,
		default: '1'
	},
	type: {
		type: String,
		default: 'code'
	}
})
const emit = defineEmits(['onValue'])
const isEdit = ref(false)
const inputValue = ref(props.value)
const handleValue = (v) => {
	inputValue.value = v
	isEdit.value = false
	emit('onValue', v)
}
</script>

<template>
	<div class="w-full text-center">
		<template v-if="props.type === 'kellZone'">
			<div class="w-full cursor-pointer" v-if="!isEdit" @click="isEdit = true">{{ inputValue }}</div>
			<NInput
				class="w-full"
				size="small"
				v-if="isEdit"
				:value="inputValue"
				@update:value="(e) => (inputValue = e)"
				@blur="(e) => handleValue(e)"
				@keyup.enter="() => handleValue(inputValue)"
			/>
		</template>
		<template v-else-if="props.type === 'code'">
			<div v-if="!isEdit" class="cursor-pointer" @click="isEdit = true">
				{{ getDictLabel(dictKey.TRADE_ORDER_CODE, inputValue) }}
			</div>
			<NSelect
				v-if="isEdit"
				class="w-full"
				@change="(e) => handleValue(e)"
				:value="inputValue"
				:options="dict[dictKey.TRADE_ORDER_CODE]"
			></NSelect>
		</template>
	</div>
</template>

<style scoped></style>
