<script setup>
defineOptions({ name: 'POI' })
import { CommonPage, MeModal, MeUpload } from '@/components/index.js'
import { NButton, NImage, NSwitch } from 'naive-ui'
import { useCrud } from '@/composables/index.js'
import api from '@/views/trade/poi/api.js'
import { ref, onMounted } from 'vue'
import { cloneDeep } from 'lodash-es'
import { mergeImageUrl } from '@/utils/index.js'

const imageSpaceRef = ref([])
const tableData = ref([])
const modelAnalysis = ref({})
const { modalRef, modalFormRef, modalForm, modalAction, handleAdd, handleDelete, handleOpen, handleEdit, handleSave } =
	useCrud({
		name: 'POI',
		initForm: { enable: true },
		doCreate: api.create,
		doDelete: api.delete,
		doUpdate: api.update,
		refresh: () => loadData()
	})
const getImage = (files) => {
	if (modalForm.value.files) {
		modalForm.value.files.push(...files)
	} else {
		modalForm.value.files = files
	}
}
const loadData = async () => {
	api.read({}).then((res) => {
		tableData.value = res.data
	})
}
onMounted(() => {
	loadData()
})
</script>

<template>
	<CommonPage>
		<template #action>
			<NButton type="primary" @click="handleAdd()">
				<i class="i-material-symbols:add mr-4 text-18" />
				添加POI
			</NButton>
		</template>
		<MeModal ref="modalRef" class="w-1/3">
			<n-form
				ref="modalFormRef"
				label-placement="left"
				label-align="left"
				:label-width="80"
				:model="modalForm"
				:disabled="modalAction === 'view'"
			>
				<n-form-item
					label="POI"
					path="name"
					:rule="{
						required: true,
						message: 'POI',
						trigger: ['input', 'blur']
					}"
				>
					<n-input v-model:value="modalForm.name" />
				</n-form-item>
				<n-form-item
					label="描述"
					path="content"
					:rule="{
						required: true,
						message: '请输入描述',
						trigger: ['input', 'blur']
					}"
				>
					<n-input type="textarea" v-model:value="modalForm.content" />
				</n-form-item>
				<n-form-item
					label="图片"
					path="files"
					:rule="{
						required: true,
						message: '请上传图片',
						trigger: ['blur', 'change', 'blur'],
						validator: (rule, value, callback) => {
							if (!value || !value.length) {
								callback(new Error('请上传图片'))
							}
						}
					}"
				>
					<div class="flex-col w-full">
						<n-button class="w-50 mb-4" round @click="imageSpaceRef.open()"
							><i class="i-material-symbols-add"></i>
						</n-button>
						<div v-if="modalForm.files?.length" class="flex gap-x-4 w-full card-border">
							<div v-for="(item, index) in modalForm.files" :key="index" class="text-center flex-col">
								<n-image :src="mergeImageUrl(item.path)" class="m-4 rounded-10 w-100 h-100" width="100" height="100" />
								<div>
									<i @click="modalForm.files.splice(index, 1)" class="i-material-symbols:delete cursor-pointer"></i>
								</div>
							</div>
						</div>
					</div>
				</n-form-item>
				<n-form-item label="排序" path="order">
					<n-input-number v-model:value="modalForm.order" :min="1" />
				</n-form-item>
			</n-form>
		</MeModal>
		<MeUpload @on-ok="getImage" :selectMultiple="true" ref="imageSpaceRef"></MeUpload>
		<div class="flex flex-wrap gap-30px">
			<n-card class="w-32%" :title="item.name" v-for="item in tableData" :key="item.id">
				<template #header-extra>
					<n-space>
						<NButton circle @click="handleDelete(item.id)" size="small">
							<i title="删除" class="i-material-symbols:delete cursor-pointer" />
						</NButton>
						<NButton circle @click="handleEdit(cloneDeep(item))" size="small">
							<i title="编辑" class="i-material-symbols:edit cursor-pointer" />
						</NButton>
					</n-space>
				</template>
				{{ item.content }}
				<template #footer>
					<n-image-group>
						<div class="flex items-center gap-x-4">
							<div class="border-0.125rem w-50 h-50" v-for="image in item.files" :key="item.id">
								<n-image :width="50" :height="50" :src="mergeImageUrl(image.path)" />
							</div>
						</div>
					</n-image-group>
				</template>
				<template #action>
					<div class="f-c-c gap-x-10 text-18">
						<div class="f-c-c" title="盈亏比">
							<i class="i-material-symbols:analytics-outline-sharp cursor-pointer" />
							<span class="text-12">{{ item.avgRRR }}R</span>
						</div>
						<div class="color-gray-400">·</div>
						<div class="f-c-c" title="胜率">
							<i class="i-material-symbols:wine-bar-rounded cursor-pointer" />
							<span class="text-12"> {{ item.rating }}%</span>
						</div>
						<div class="color-gray-400">·</div>
						<div class="f-c-c" title="下单总数">
							<i class="i-material-symbols:nest-secure-alarm-outline cursor-pointer" />
							<span class="text-12"> {{ item.total }}</span>
						</div>
					</div>
				</template>
			</n-card>
		</div>
	</CommonPage>
</template>

<style scoped>
:deep(.n-card__action) {
	padding: 10px;
}
</style>
