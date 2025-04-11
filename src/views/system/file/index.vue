<!--------------------------------
 - @Author:
 - @LastEditor:
 - @LastEditTime: 2023/12/05 21:28:02
 - @Email:
 -
 --------------------------------->

<template>
	<MeUpload></MeUpload>
</template>

<script setup>
defineOptions({ name: 'ImgUpload' })
import { MeUpload } from '@/components/index.js'

const imgList = reactive([
	{ url: 'https://img.isme.top/isme/67208863145ef.jpg' },
	{ url: 'https://img.isme.top/isme/67208ab2a9de0.jpg' },
	{ url: 'https://img.isme.top/isme/67208ab4c6596.jpg' }
])
</script>
