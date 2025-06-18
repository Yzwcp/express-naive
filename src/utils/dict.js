import { isNullOrUndef } from '@/utils/is.js'
export const dictKey = {
	FILE_SAVE_PLATFORM: 'FILE_SAVE_PLATFORM',
	GOODS_ORDER_STATUS: 'GOODS_ORDER_STATUS',
	GOODS_ORDER_PAYMENT_TYPE: 'GOODS_ORDER_PAYMENT_TYPE',
	TRADE_KILL_ZONE: 'TRADE_KILL_ZONE',
	TRADE_PLATFORM: 'TRADE_PLATFORM',
	TRADE_ORDER_STATUS: 'TRADE_ORDER_STATUS',
	TRADE_ORDER_DIRECTION: 'TRADE_ORDER_DIRECTION',
	TRADE_ORDER_CODE: 'TRADE_ORDER_CODE'
}
export const dict = {
	[dictKey.FILE_SAVE_PLATFORM]: [
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
	[dictKey.GOODS_ORDER_STATUS]: [
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
	[dictKey.GOODS_ORDER_PAYMENT_TYPE]: [
		{
			label: '支付宝',
			value: '0'
		},
		{
			label: '微信',
			value: '1'
		}
	],
	[dictKey.TRADE_KILL_ZONE]: [
		{
			label: '纽约',
			value: '1'
		},
		{
			label: '伦敦',
			value: '2'
		},
		{
			label: '亚洲',
			value: '3'
		}
	],
	[dictKey.TRADE_PLATFORM]: [
		{
			label: 'FTMO',
			value: '1'
		},
		{
			label: 'TOPSTEP',
			value: '2'
		},
		{
			label: 'FXREPLAY',
			value: '3'
		}
	],
	[dictKey.TRADE_ORDER_STATUS]: [
		{
			label: '止盈',
			value: '1'
		},
		{
			label: '止损',
			value: '2'
		},
		{
			label: '保本',
			value: '3'
		}
	],
	[dictKey.TRADE_ORDER_DIRECTION]: [
		{
			label: '做多',
			value: '1'
		},
		{
			label: '做空',
			value: '2'
		}
	],
	[dictKey.TRADE_ORDER_CODE]: [
		{
			label: 'NQ',
			value: '1'
		},
		{
			label: 'ES',
			value: '2'
		},
		{
			label: 'GC',
			value: '3'
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
