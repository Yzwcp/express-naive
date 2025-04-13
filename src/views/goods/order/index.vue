<!--------------------------------
 - @Author:
 - @LastEditor:
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email:
 -
 --------------------------------->

<template>
	<CommonPage>
		<MeCrud ref="$table" v-model:query-items="queryItems" :scroll-x="1200" :columns="columns" :get-data="api.read">
			<!--			<MeQueryItem label="名称" :label-width="50">-->
			<!--				<n-input v-model:value="queryItems.name" type="text" placeholder="请输入名称" clearable />-->
			<!--			</MeQueryItem>-->
			<MeQueryItem label="状态" :label-width="50">
				<n-select v-model:value="queryItems.status" clearable :options="dict.GOODS_ORDER_STATUS" />
			</MeQueryItem>
		</MeCrud>
		<OrderDetail ref="$orderDetail"></OrderDetail>
	</CommonPage>
</template>

<script setup>
import { CommonPage, MeCrud, MeModal, MeQueryItem } from '@/components/index.js'
import { useCrud } from '@/composables/index.js'
import { dict, formatDateTime, getDictLabel } from '@/utils/index.js'
import { NAvatar, NButton, NSwitch, NTag, NImage } from 'naive-ui'
import api from './api.js'
import OrderDetail from '@/views/goods/order/components/OrderDetail.vue'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
const $orderDetail = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const payLoading = ref(false)

onMounted(() => {
	$table.value?.handleSearch()
})

const {
	modalRef,
	modalFormRef,
	modalForm,
	modalAction,
	handleAdd,
	handleDelete,
	handleOpen,
	handleEdit,
	handleSave,
	handleView
} = useCrud({
	name: '订单',
	initForm: { enable: true },
	doCreate: api.create,
	doDelete: api.delete,
	doUpdate: api.update,
	refresh: () => $table.value?.handleSearch()
})

const columns = [
	{
		title: '商品名称',
		key: 'goods.name',
		width: 80
	},
	{ title: '订单号', key: 'outTradeNo', width: 100, ellipsis: { tooltip: true } },
	{ title: '流水号', key: 'tradeNo', width: 100, ellipsis: { tooltip: true } },
	{ title: '支付金额', key: 'amount', width: 60 },
	{ title: '总价', key: 'totalAmount', width: 60 },
	{
		title: '支付平台',
		key: 'paymentMethod',
		width: 60,
		render(row) {
			return h(
				NTag,
				{
					type: row.paymentMethod === '0' ? 'info' : 'success'
				},
				{ default: () => getDictLabel('GOODS_ORDER_PAYMENT_TYPE', row.paymentMethod) }
			)
		}
	},
	{
		title: '状态',
		key: 'status',
		width: 60,
		render(row) {
			return h(
				NTag,
				{ type: row.status === '1' ? 'success' : 'error' },
				{ default: () => getDictLabel('GOODS_ORDER_STATUS', row.status) }
			)
		}
	},
	{ title: '支付时间', key: 'paidAt', width: 120 },
	{
		title: '创建时间',
		key: 'createdAt',
		width: 120
	},
	{
		title: '图片',
		key: 'goods.files',
		width: 180,
		render(row) {
			//渲染循环NImage组件
			return h(
				'div',
				{
					class: 'flex gap-x-4 w-full  '
				},
				h(NImage, {
					src: row.goods?.files[0]?.fullPath,
					class: 'm-4 rounded-10 w-60 h-60',
					width: '60',
					height: '60'
				})
			)
		}
	},
	{ title: '备注', key: 'description', width: 120, ellipsis: { tooltip: true } },

	{
		title: '操作',
		key: 'actions',
		width: 320,
		align: 'right',
		fixed: 'right',
		hideInExcel: true,
		render(row) {
			return [
				row.status === '0' &&
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
							default: () => '支付',
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
						onClick: () => $orderDetail.value.open(row)
					},
					{
						default: () => '详情',
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
		const { data } = await api.alipay({ outTradeNo: row.outTradeNo })
		open(data)
		$message.success('操作成功')
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
