<!--------------------------------
 - @Author:
 - @LastEditor:
 - @LastEditTime: 2024/04/01 15:52:40
 - @Email:
 -
 --------------------------------->

<template>
	<CommonPage>
		<MeUpload ref="uploadRef"></MeUpload>

		<template #action>
			<NButton type="primary" @click="uploadRef.open()">
				<i class="i-material-symbols:image mr-4 text-18" />
				新增图片
			</NButton>
		</template>

		<MeCrud
			ref="$table"
			:show-search="false"
			v-model:query-items="queryItems"
			:scroll-x="1200"
			:columns="columns"
			:get-data="api.list"
		>
			<!--			<MeQueryItem label="角色名" :label-width="50">-->
			<!--				<n-input v-model:value="queryItems.name" type="text" placeholder="请输入角色名" clearable />-->
			<!--			</MeQueryItem>-->
			<!--			<MeQueryItem label="状态" :label-width="50">-->
			<!--				<n-select-->
			<!--					v-model:value="queryItems.enable"-->
			<!--					clearable-->
			<!--					:options="[-->
			<!--						{ label: '启用', value: 1 },-->
			<!--						{ label: '停用', value: 0 }-->
			<!--					]"-->
			<!--				/>-->
			<!--			</MeQueryItem>-->
		</MeCrud>
		<MeModal ref="modalRef" width="520px">
			<n-form ref="modalFormRef" label-placement="left" label-align="left" :label-width="80" :model="modalForm">
				<n-form-item
					label="角色名"
					path="name"
					:rule="{
						required: true,
						message: '请输入角色名',
						trigger: ['input', 'blur']
					}"
				>
					<n-input v-model:value="modalForm.name" />
				</n-form-item>
				<n-form-item
					label="角色编码"
					path="code"
					:rule="{
						required: true,
						message: '请输入角色编码',
						trigger: ['input', 'blur']
					}"
				>
					<n-input v-model:value="modalForm.code" :disabled="modalAction !== 'add'" />
				</n-form-item>

				<n-form-item label="状态" path="enable">
					<NSwitch v-model:value="modalForm.enable">
						<template #checked> 启用 </template>
						<template #unchecked> 停用 </template>
					</NSwitch>
				</n-form-item>
			</n-form>
		</MeModal>
	</CommonPage>
</template>

<script setup>
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { getDictLabel, dictKey, mergeImageUrl } from '@/utils'
import { useCrud } from '@/composables'
import { NButton, NSwitch, NImage } from 'naive-ui'
import { MeUpload } from '@/components'
import api from './api'

defineOptions({ name: 'RoleMgt' })

const router = useRouter()

const $table = ref(null)
const uploadRef = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
	$table.value?.handleSearch()
})

const { modalRef, modalFormRef, modalAction, modalForm, handleAdd, handleDelete, handleEdit } = useCrud({
	name: '角色',
	doCreate: api.create,
	doDelete: api.delete,
	doUpdate: api.update,
	initForm: { enable: true },
	refresh: (_, keepCurrentPage) => $table.value?.handleSearch(keepCurrentPage)
})

const columns = [
	{ title: '序号', key: 'id', render: (row, index) => index + 1 },
	{
		title: '图片',
		key: 'fullPath',
		render: (row) => {
			return h(NImage, {
				src: mergeImageUrl(row.path),
				class: 'w-40 h-20'
			})
		}
	},
	{ title: '文件名', key: 'originalName' },
	{ title: '分类', key: 'classify' },
	{ title: '类型', key: 'fileType' },
	{ title: '大小', key: 'sizeString' },
	{ title: '存储类型', key: 'saveType', render: (row) => getDictLabel(dictKey.FILE_SAVE_PLATFORM, row.saveType) },
	{ title: '创建时间', key: 'createdAt' },
	{
		title: '操作',
		key: 'actions',
		width: 320,
		align: 'right',
		fixed: 'right',
		render(row) {
			return [
				h(
					NButton,
					{
						size: 'small',
						type: 'error',
						style: 'margin-left: 12px;',
						disabled: row.code === 'SUPER_ADMIN',
						onClick: () => handleDelete(row.id)
					},
					{
						default: () => '删除',
						icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' })
					}
				)
			]
		}
	}
]

async function handleEnable(row) {
	row.enableLoading = true
	try {
		await api.update({ id: row.id, enable: !row.enable })
		row.enableLoading = false
		$message.success('操作成功')
		$table.value?.handleSearch()
	} catch (error) {
		console.error(error)
		row.enableLoading = false
	}
}
</script>
