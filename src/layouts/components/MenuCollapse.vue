<!--------------------------------
 - @Author:
 - @LastEditor:
 - @LastEditTime: 2023/12/16 18:50:18
 - @Email:
 -
 --------------------------------->

<template>
	<div
		id="menu-collapse"
		class="f-c-c cursor-pointer rounded-4 p-6 text-22 transition-all-300 auto-bg-hover"
		@click="appStore.switchCollapsed"
	>
		<i :class="appStore.collapsed ? 'i-line-md-menu-unfold-left' : 'i-line-md-menu-fold-left'" />
	</div>
</template>

<script setup>
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>
