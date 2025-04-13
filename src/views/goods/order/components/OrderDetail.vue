<script setup>
import { MeModal } from '@/components/index.js'
import { NImage } from 'naive-ui'
import { getDictLabel } from '@/utils/index.js'

const $orderDetail = ref(null)
const detail = ref({})
function open(row) {
	detail.value = row || {}
	$orderDetail.value.open()
}
defineExpose({
	open
})
</script>

<template>
	<MeModal :show-cancel="false" :show-ok="false" width="66%" title="订单详情" ref="$orderDetail">
		<n-descriptions bordered :column="6">
			<n-descriptions-item label="商品名称"> {{ detail?.goods?.name }}</n-descriptions-item>
			<n-descriptions-item label="订单号"> {{ detail?.outTradeNo }}</n-descriptions-item>
			<n-descriptions-item label="流水号"> {{ detail?.tradeNo }}</n-descriptions-item>
			<n-descriptions-item label="支付金额"> {{ detail?.amount }}</n-descriptions-item>
			<n-descriptions-item label="总价"> {{ detail?.totalAmount }}</n-descriptions-item>
			<n-descriptions-item label="支付平台">
				{{ getDictLabel('GOODS_ORDER_PAYMENT_TYPE', detail?.paymentMethod) }}
			</n-descriptions-item>
			<n-descriptions-item label="状态"> {{ getDictLabel('GOODS_ORDER_STATUS', detail?.status) }}</n-descriptions-item>
			<n-descriptions-item label="支付时间"> {{ detail?.paidAt }}</n-descriptions-item>
			<n-descriptions-item label="创建时间"> {{ detail?.createdAt }}</n-descriptions-item>
			<n-descriptions-item label="备注"> {{ detail?.description }}</n-descriptions-item>
			<n-descriptions-item label="商品图片">
				<n-image
					v-if="detail?.goods?.files?.length"
					:src="detail.goods.files[0].fullPath"
					class="m-4 rounded-10 w-60 h-60"
					width="60"
					height="60"
				/>
			</n-descriptions-item>
		</n-descriptions>
	</MeModal>
</template>

<style scoped></style>
