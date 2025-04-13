<!--------------------------------
 - @Author:
 - @LastEditor:
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email:
 -
 --------------------------------->

<template>
	<CommonPage>
		<template #action>
			<NButton type="primary" @click="handleAdd()">
				<i class="i-material-symbols:add mr-4 text-18" />
				添加规格
			</NButton>
		</template>
		<MeCrud ref="$table" v-model:query-items="queryItems" :scroll-x="1200" :columns="columns" :get-data="api.read">
			<MeQueryItem label="名称" :label-width="50">
				<n-input v-model:value="queryItems.name" type="text" placeholder="请输入名称" clearable />
			</MeQueryItem>
			<MeQueryItem label="状态" :label-width="50">
				<n-select
					v-model:value="queryItems.enable"
					clearable
					:options="[
						{ label: '启用', value: '1' },
						{ label: '停用', value: '0' }
					]"
				/>
			</MeQueryItem>
		</MeCrud>

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
					label="规格标题"
					path="name"
					:rule="{
						required: true,
						message: '请输入名称',
						trigger: ['input', 'blur']
					}"
				>
					<n-input v-model:value="modalForm.name" />
				</n-form-item>
				<n-form-item
					label="所属商品"
					path="goodsId"
					:rule="{
						required: true,
						message: '请选择所属商品',
						trigger: ['input', 'blur'],
						type: 'number'
					}"
				>
					<n-select v-model:value="modalForm.goodsId" clearable :options="goodsOption" />
				</n-form-item>
				<n-form-item
					label="价格"
					path="price"
					:min="0.01"
					:rule="[
						{
							required: true,
							message: '请输入价格',
							trigger: ['input', 'blur'],
							type: 'number'
						}
					]"
				>
					<n-input-number v-model:value="modalForm.price" />
				</n-form-item>
				<n-form-item
					label="售卖价格"
					path="salePrice"
					:min="0.01"
					:rule="{
						required: true,
						message: '请输入售卖价格',
						trigger: ['input', 'blur'],
						type: 'number'
					}"
				>
					<n-input-number :min="0.01" v-model:value="modalForm.salePrice" />
				</n-form-item>
				<n-form-item
					label="库存"
					path="stock"
					:min="1"
					:rule="{
						required: true,
						message: '请输入库存',
						trigger: ['input', 'blur'],
						type: 'number'
					}"
				>
					<n-input-number :min="1" v-model:value="modalForm.stock" />
				</n-form-item>

				<n-form-item label="排序" path="order">
					<n-input-number v-model:value="modalForm.order" :min="1" />
				</n-form-item>
				<n-form-item v-if="modalAction === 'add'" label="状态" path="enable">
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
import { CommonPage, MeCrud, MeModal, MeQueryItem } from '@/components/index.js'
import { useCrud } from '@/composables/index.js'
import { withPermission } from '@/directives/index.js'
import { formatDateTime } from '@/utils/index.js'
import { NAvatar, NButton, NSwitch, NTag, NImage } from 'naive-ui'
import api from './api.js'
import goodsApi from '@/views/goods/list/api.js'
import orderApi from '@/views/goods/order/api.js'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'GoodSku' })

const router = useRouter()
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const payLoading = ref(false)
const goodsOption = ref([])

onMounted(() => {
	$table.value?.handleSearch()
	goodsApi.read({ enable: 1 }).then((res) => {
		goodsOption.value = res.data.map((item) => {
			return {
				label: item.name,
				value: item.id
			}
		})
	})
})

const { modalRef, modalFormRef, modalForm, modalAction, handleAdd, handleDelete, handleOpen, handleEdit, handleSave } =
	useCrud({
		name: '规格',
		initForm: { enable: true },
		doCreate: api.create,
		doDelete: api.delete,
		doUpdate: api.update,
		refresh: () => $table.value?.handleSearch()
	})

const columns = [
	{
		title: '标题',
		key: 'name'
	},
	// { title: '描述', key: 'description', width: 150, ellipsis: { tooltip: true } },
	// { title: '服务', key: 'service', width: 150, ellipsis: { tooltip: true } },

	{
		title: '价格',
		key: 'price'
	},
	{
		title: '售卖价格',
		key: 'salePrice'
	},
	{
		title: '库存',
		key: 'stock'
	},
	{ title: '排序', key: 'order' },
	{
		title: '创建时间',
		key: 'createdAt'
	},
	{
		title: '状态',
		key: 'enable',
		render: (row) =>
			h(
				NSwitch,
				{
					size: 'small',
					rubberBand: false,
					value: row.enable,
					loading: !!row.enableLoading,
					onUpdateValue: () => handleEnable(row)
				},
				{
					checked: () => '启用',
					unchecked: () => '停用'
				}
			)
	},
	{
		title: '操作',
		key: 'actions',
		width: 320,
		align: 'right',
		fixed: 'right',
		hideInExcel: true,
		render(row) {
			return [
				h(
					NButton,
					{
						size: 'small',
						type: 'primary',
						style: 'margin-left: 12px;',
						disabled: row.code === 'SUPER_ADMIN',
						onClick: () => handlePay(row),
						loading: payLoading.value
					},
					{
						default: () => '创建支付',
						icon: () => h('i', { class: 'i-material-symbols:paid text-14' })
					}
				),
				h(
					NButton,
					{
						size: 'small',
						type: 'primary',
						style: 'margin-left: 12px;',
						disabled: row.code === 'SUPER_ADMIN',
						onClick: () => handleEdit(cloneDeep({ ...row, files: row.files }))
					},
					{
						default: () => '编辑',
						icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' })
					}
				),
				h(
					NButton,
					{
						size: 'small',
						type: 'error',
						style: 'margin-left: 12px;',
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
async function handlePay(row) {
	payLoading.value = true
	try {
		await orderApi.create({
			skuId: row.id,
			goodsId: row.goodsId,
			quantity: 1
		})
		$message.success('订单创建成功')
		router.push({ path: '/goods/order' })
	} finally {
		payLoading.value = false
	}
}
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
