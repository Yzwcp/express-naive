<!--------------------------------
 - @Author:
 - @LastEditor:
 - @LastEditTime: 2023/12/04 22:51:04
 - @Email:
 -
 --------------------------------->

<template>
	<div class="auto-bg" :class="{ 'card-border': bordered }">
		<slot />
	</div>
</template>

<script setup>
defineProps({
	bordered: Boolean
})
</script>
