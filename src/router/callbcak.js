export const callbcak = [
	{
		name: 'AliyunCallback',
		path: '/alipay/callback',
		component: () => import('@/views/callback/alipay.vue'),
		meta: {
			title: '阿里云支付',
			layout: 'empty'
		}
	}
]
