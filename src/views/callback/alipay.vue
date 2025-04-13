<script setup>
import api from './api.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const success = ref(false)
const query = route.query
api.validateAliPay(query).then(({ data }) => {
	success.value = data
	router.push({
		path: '/goods/order'
	})
})
</script>

<template>{{ success }}</template>

<style scoped></style>
