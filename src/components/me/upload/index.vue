<!--------------------------------
 - @Author:
 - @LastEditor:
 - @LastEditTime: 2023/12/05 21:28:02
 - @Email:
 -
 --------------------------------->

<template>
	<n-modal v-model:show="showModal" class="w-1/2" title="文件列表" preset="card">
		<n-space align="center" justify="space-between">
			<!--			<img src="http://127.0.0.1:9000/uploads/temp/19a14aee2ee1459a8b50e3caecb8072f.png" alt="" />-->
			<div class="f-c-c gap-x-10">
				<!--				<n-radio-group v-model:value="typeValue">-->
				<!--					<n-radio-button v-for="type in types" :key="type.value" :value="type.value" :label="type.label" />-->
				<!--				</n-radio-group>-->
				<n-radio-group v-model:value="classify" @update:value="loadFileList">
					<n-radio-button v-for="type in classifyList" :key="type.value" :value="type.value" :label="type.label" />
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
				:action="uploadAction"
				@before-upload="onBeforeUpload"
				@finish="handleFinish"
				:data="{
					classify: classify
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
							class="w-150 rounded-20 hover:card-shadow p-0 overflow-hidden group"
						>
							<div
								:title="item.originalName"
								class="px-10 py-2 absolute text-center left-0px mb-10px top-0px bg-primary color-#fff text-md w-full text-hide-over"
							>
								{{ item.originalName }}
							</div>
							<div class="h-90 f-c-c mt-16 cursor-pointer" @click="select(item)">
								<n-image width="200" :src="mergeImageUrl(item.path)" />
							</div>
							<div class="mt-10 f-c-c gap-x-12" justify="space-evenly">
								<div class="hidden group-hover:block">
									<n-button size="tiny" dashed type="error" @click="remove(item)">
										<i class="i-material-symbols-delete-rounded"></i>
									</n-button>
								</div>
								<div>
									<n-button :dashed="!selectIdList.includes(item.id)" type="primary" size="tiny" @click="select(item)">
										{{ selectIdList.includes(item.id) ? '取消' : '选择' }}
									</n-button>
								</div>
								<!--								<n-button dashed type="primary" @click="copy(`![${item.fileName}](${item.url})`)"> MD </n-button>-->
							</div>
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
import { mergeImageUrl } from '@/utils/index.js'

defineOptions({ name: 'ImgUpload' })
import { NButton } from 'naive-ui'
import { useAuthStore } from '@/store/index.js'
import api from '@/api'
const env = import.meta.env

const authStore = useAuthStore()
const emit = defineEmits(['onOk'])
//获取环境变量
const uploadAction = env.VITE_AXIOS_BASE_URL + '/sys/file/upload'
const showModal = ref(false)
const loading = ref(false)
const typeValue = ref('image')
const selectList = ref([])
const selectIdList = computed(() => {
	return selectList.value.map((item) => item.id)
})
const page = reactive({
	pageNo: 1,
	pageSize: 15,
	total: 0
})
const imgList = ref([])
const props = defineProps({
	classify: {
		type: String,
		default: 'temp'
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
const classifyList = [
	{ label: '全部', value: '' },
	{ label: '其他', value: 'temp' },
	{ label: '交易', value: 'trade' }
]
const classify = ref(props.classify)
const onPageChange = () => {
	loadFileList()
}
const remove = (item) => {
	const d = $dialog.warning({
		content: '确定删除？',
		title: '提示',
		positiveText: '确定',
		negativeText: '取消',
		async onPositiveClick() {
			try {
				d.loading = true
				await api.removeFile(item.id)
				$message.success('删除成功')
				d.loading = false
				loadFileList()
			} catch (error) {
				d.loading = false
			}
		}
	})
}
const select = (item) => {
	if (props.selectMultiple) {
		if (selectIdList.value.includes(item.id)) {
			selectList.value = selectList.value.filter((i) => i.id !== item.id)
		} else {
			selectList.value.push(item)
		}
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
	const { data } = await api.getFileList({ ...page, classify: classify.value })
	loading.value = false
	imgList.value = data.pageData
	page.total = data.total
}
const open = () => {
	loadFileList()
	selectList.value = []
	showModal.value = true
}
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

defineExpose({
	open
})
</script>
