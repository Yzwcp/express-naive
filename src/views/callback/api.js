import { request } from '@/utils'

export default {
	validateAliPay: (data) => request.post('/goods/order/alipay/validate', data)
}
