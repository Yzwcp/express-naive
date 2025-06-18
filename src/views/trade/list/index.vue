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
			<NButton type="primary" @click="handleAddRow()">
				<i class="i-material-symbols:add mr-4 text-18" />
				添加日志
			</NButton>
		</template>
		<MeCrud
			@onDataChange="onDataChange"
			ref="$table"
			v-model:query-items="queryItems"
			:scroll-x="1200"
			:columns="columns"
			:get-data="api.read"
		>
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
					label="商品名称"
					path="name"
					:rule="{
						required: true,
						message: '请输入商品名称',
						trigger: ['input', 'blur']
					}"
				>
					<n-input v-model:value="modalForm.name" />
				</n-form-item>
				<n-form-item
					label="商品描述"
					path="description"
					:rule="{
						required: true,
						message: '请输入商品名称',
						trigger: ['input', 'blur']
					}"
				>
					<n-input type="textarea" v-model:value="modalForm.description" />
				</n-form-item>
				<n-form-item
					label="商品服务"
					path="service"
					:rule="{
						required: true,
						message: '请输入服务',
						trigger: ['input', 'blur']
					}"
				>
					<n-input placeholder="7天无理由退货" v-model:value="modalForm.service" />
				</n-form-item>
				<n-form-item
					label="商品图片"
					path="files"
					:rule="{
						required: true,
						message: '请上传商品图片',
						trigger: ['blur', 'change', 'blur'],
						validator: (rule, value, callback) => {
							if (!value || !value.length) {
								callback(new Error('请上传商品图片'))
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
								<n-image :src="item.fullPath" class="m-4 rounded-10 w-60 h-60" width="60" height="60" />
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
				<n-form-item v-if="modalAction === 'add'" label="状态" path="enable">
					<NSwitch v-model:value="modalForm.enable">
						<template #checked> 启用 </template>
						<template #unchecked> 停用 </template>
					</NSwitch>
				</n-form-item>
			</n-form>
		</MeModal>
		<MeUpload @on-ok="getImage" ref="imageSpaceRef"></MeUpload>
	</CommonPage>
</template>

<script setup>
import { CommonPage, MeCrud, MeModal, MeQueryItem } from '@/components/index.js'
import { useCrud } from '@/composables/index.js'
import EditRow from '@/views/trade/list/components/EditRow.vue'
import { withPermission } from '@/directives/index.js'
import { dictKey, formatDateTime } from '@/utils/index.js'
import { NAvatar, NButton, NSwitch, NTag, NImage } from 'naive-ui'
import { MeUpload } from '@/components/index.js'
import api from './api.js'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const imageSpaceRef = ref(null)
const templateRow = ref({
	code: '',
	killZone: '',
	orderLabel: '',
	orderTime: '',
	profit: '',
	risk: '',
	platform: '',
	remark: '',
	status: '',
	enable: true
})
onMounted(() => {
	$table.value?.handleSearch()
})

const onEditRow = (row, v, key) => {
	row.editable = true
	row[key] = v
}

const { modalRef, modalFormRef, modalForm, modalAction, handleAdd, handleDelete, handleOpen, handleEdit, handleSave } =
	useCrud({
		name: '商品',
		initForm: { enable: true },
		doCreate: api.create,
		doDelete: api.delete,
		doUpdate: api.update,
		refresh: () => $table.value?.handleSearch()
	})

const columns = [
	{
		title: '商品代码',
		key: 'code',
		width: 100,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.code,
				onChangeValue: (v) => onEditRow(row, v, 'code'),
				type: 'select',
				dictKey: dictKey.TRADE_ORDER_CODE
			})
		}
	},
	{
		title: '杀戮区',
		key: 'killZone',
		width: 100,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.code,
				onChangeValue: (v) => onEditRow(row, v, 'killZone'),
				type: 'select',
				dictKey: dictKey.TRADE_KILL_ZONE
			})
		}
	},
	{ title: '标签', key: 'orderLabel', width: 150, ellipsis: { tooltip: true } },
	{
		title: '下单时间',
		key: 'orderTime',
		width: 150,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.orderTime,
				onChangeValue: (v) => onEditRow(row, v, 'orderTime'),
				type: 'time'
			})
		}
	},
	{
		title: '盈利',
		align: 'center',
		key: 'profit',
		width: 60,
		render(row) {
			return h(EditRow, {
				value: row.profit,
				onChangeValue: (v) => onEditRow(row, v, 'profit'),
				type: 'input'
			})
		}
	},
	{
		title: '风险',
		key: 'risk',
		width: 60,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.risk,
				onChangeValue: (v) => onEditRow(row, v, 'risk'),
				type: 'input'
			})
		}
	},
	{
		title: '平台',
		key: 'platform',
		width: 100,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.platform,
				onChangeValue: (v) => onEditRow(row, v, 'platform'),
				type: 'select',
				dictKey: dictKey.TRADE_PLATFORM
			})
		}
	},
	{
		title: '备注',
		key: 'remark',
		width: 60,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.risk,
				onChangeValue: (v) => onEditRow(row, v, 'remark'),
				type: 'input'
			})
		}
	},
	{
		title: '状态',
		key: 'status',
		width: 100,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.platform,
				onChangeValue: (v) => onEditRow(row, v, 'status'),
				type: 'select',
				dictKey: dictKey.TRADE_ORDER_STATUS
			})
		}
	},

	{
		title: '创建时间',
		key: 'createdAt',
		width: 180
	},

	{
		title: '显示',
		key: 'enable',
		width: 120,
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
				row.editable &&
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
							default: () => '保存',
							icon: () => h('i', { class: 'i-material-symbols:save text-14' })
						}
					)
			]
		}
	}
]
const getImage = (files) => {
	if (modalForm.value.files) {
		modalForm.value.files.push(...files)
	} else {
		modalForm.value.files = files
	}
}
function handleAddRow() {
	$table.value?.tableData.push(cloneDeep(templateRow.value))
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

function onSave() {
	if (modalAction.value === 'setRole') {
		return handleSave({
			api: () => api.setRole(modalForm.value),
			cb: () => $message.success('分配成功')
		})
	} else if (modalAction.value === 'reset') {
		return handleSave({
			api: () => api.resetPwd(modalForm.value.id, modalForm.value),
			cb: () => $message.success('密码重置成功')
		})
	}
	handleSave()
}
</script>
