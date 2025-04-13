import { isNullOrUndef } from '@/utils/is.js'
export const dictKey = {
	FILE_SAVE_PLATFORM: 'FILE_SAVE_PLATFORM'
}
export const dict = {
	FILE_SAVE_PLATFORM: [
		{
			label: '本地',
			value: 'local'
		},
		{
			label: '七牛云',
			value: 'qiniu'
		},
		{
			label: '阿里云',
			value: 'aliyun'
		},
		{
			label: '腾讯云',
			value: 'tencent'
		}
	],
	//订单状态 0:未支付 1:已支付 2:已取消 3:已退款 4:已完成
	GOODS_ORDER_STATUS: [
		{
			label: '未支付',
			value: '0'
		},
		{
			label: '已支付',
			value: '1'
		},
		{
			label: '已取消',
			value: '2'
		},
		{
			label: '已退款',
			value: '3'
		}
	],
	//支付方式 0:支付宝 1:微信
	GOODS_ORDER_PAYMENT_TYPE: [
		{
			label: '支付宝',
			value: '0'
		},
		{
			label: '微信',
			value: '1'
		}
	]
}

export const getDictLabel = (key, value) => {
	if (isNullOrUndef(value)) return ''
	if (isNullOrUndef(key)) return ''
	console.log(key, value)
	const item = dict[key].find((item) => item.value == value)
	return item?.label || ''
}
