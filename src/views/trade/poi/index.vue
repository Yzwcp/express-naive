<script setup>
import { CommonPage } from '@/components/index.js'
import { NButton } from 'naive-ui'
</script>

<template>
	<CommonPage>
		<template #action>
			<NButton type="primary" @click="handleAddRow()">
				<i class="i-material-symbols:add mr-4 text-18" />
				添加日志
			</NButton>
		</template>
		<div class="flex flex-wrap justify-center gap-30px">
			<n-card class="w-32%" title="供需翻转" v-for="item in 10" :key="item">
				<template #header-extra>
					<NButton circle size="small">
						<i class="i-material-symbols:edit cursor-pointer" />
					</NButton>
				</template>
				卡片内容
				<template #footer> #footer </template>
				<template #action> #action </template>
			</n-card>
		</div>
	</CommonPage>
</template>

<style scoped></style>
