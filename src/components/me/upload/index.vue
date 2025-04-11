<!--------------------------------
 - @Author:
 - @LastEditor:
 - @LastEditTime: 2023/12/05 21:28:02
 - @Email:
 -
 --------------------------------->

<template>
	<n-button @click="showModal = true"></n-button>
	<n-modal v-model:show="showModal" class="w-1/2" title="文件列表" :mask-closable="false" preset="card">
		<n-space align="center" justify="space-between">
			<div class="f-c-c gap-x-10">
				<n-radio-group v-model:value="typeValue">
					<n-radio-button v-for="type in types" :key="type.value" :value="type.value" :label="type.label" />
				</n-radio-group>
				<NButton :loading="loading" type="default" link @click="loadFileList">
					<i class="i-material-symbols:refresh text-18" />
					刷新
				</NButton>
			</div>
			<n-upload
				class="mx-auto w-[75%] p-20 text-center"
				:show-file-list="false"
				accept=".png,.jpg,.jpeg"
				multiple
				list-type="image"
				action="http://localhost:3000/file/upload"
				@before-upload="onBeforeUpload"
				@finish="handleFinish"
				:data="{
					classify: '1'
				}"
				:headers="{
					Authorization: `Bearer ${authStore.accessToken}`
				}"
			>
				<NButton type="primary">
					<i class="i-material-symbols:upload mr-4 text-18" />
					添加文件
				</NButton>
			</n-upload>
		</n-space>
		<n-spin :show="loading">
			<n-card class="mt-16 items-center min-h-625">
				<n-empty v-if="imgList && imgList.length === 0" description="没有图片数据"></n-empty>
				<n-image-group>
					<n-space align="center">
						<n-card
							v-for="(item, index) in imgList"
							:key="index"
							class="w-150 rounded-20 hover:card-shadow p-0 overflow-hidden"
						>
							<div
								:title="item.originalName"
								class="px-10 py-2 absolute text-center left-0px mb-10px top-0px bg-primary color-#fff text-md w-full text-hide-over"
							>
								{{ item.originalName }}
							</div>
							<div class="h-90 f-c-c mt-16">
								<n-image width="200" :src="item.fullPath" />
							</div>

							<n-space class="mt-10" justify="space-evenly">
								<n-button dashed type="primary" size="tiny" @click="select(item)"> 选择 </n-button>
								<!--								<n-button dashed type="primary" @click="copy(`![${item.fileName}](${item.url})`)"> MD </n-button>-->
							</n-space>
						</n-card>
						<div v-for="i in 4" :key="i" class="w-280" />
					</n-space>
				</n-image-group>
			</n-card>
		</n-spin>
		<template #footer>
			<div class="flex justify-between mt-10">
				<div class=""></div>
				<n-pagination @change="onPageChange" v-model:page="page.pageNo" :item-count="page.total" />
				<div>
					<n-button type="primary" @click="ok" v-if="props.selectMultiple"> 确定 </n-button>
				</div>
			</div>
		</template>
	</n-modal>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import { NButton } from 'naive-ui'
import { useAuthStore } from '@/store/index.js'
import api from '@/api'
const authStore = useAuthStore()
defineOptions({ name: 'ImgUpload' })
const emit = defineEmits(['onOk'])
const { copy, copied } = useClipboard()

const showModal = ref(true)
const loading = ref(false)
const typeValue = ref('image')
const selectList = ref([])
const page = reactive({
	pageNo: 1,
	pageSize: 15,
	total: 0
})
const imgList = ref([
	{ url: 'https://img.isme.top/isme/67208863145ef.jpg' },
	{ url: 'https://img.isme.top/isme/67208ab2a9de0.jpg' },
	{ url: 'https://img.isme.top/isme/67208ab4c6596.jpg' }
])
const props = defineProps({
	classify: {
		type: String,
		default: '1'
	},
	selectMultiple: {
		type: Boolean,
		default: false
	}
})

const types = [
	{ label: '图片', value: 'image' },
	{ label: '视频', value: 'video' }
]
watch(copied, (val) => {
	if (val) $message.success('已复制到剪切板')
})
const onPageChange = () => {
	loadFileList()
}
const select = (item) => {
	if (props.selectMultiple) {
		selectList.value.push(item)
		// emit('onOk', [item])
		return
	}
	showModal.value = false
	emit('onOk', [item])
}
const ok = () => {
	showModal.value = false
	emit('onOk', selectList.value)
}
const loadFileList = async () => {
	loading.value = true
	const { data } = await api.getFileList(page)
	loading.value = false
	imgList.value = data.pageData
	page.total = data.total
}
loadFileList()
function onBeforeUpload({ file }) {
	if (!file.file?.type.startsWith('image/')) {
		$message.error('只能上传图片')
		return false
	}
	return true
}
function handleFinish() {
	loadFileList()
}
async function handleUpload({ file, data, headers, withCredentials, action, onFinish, onError, onProgress }) {
	if (!file || !file.type) {
		$message.error('请选择文件')
	}
	console.log(file)
	// 模拟上传
	$message.loading('上传中...')
	setTimeout(() => {
		$message.success('上传成功')
		imgList.push({ fileName: file.name, url: URL.createObjectURL(file.file) })
		onFinish()
	}, 1500)
}
</script>
