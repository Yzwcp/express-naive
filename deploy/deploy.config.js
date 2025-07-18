module.exports = {
	privateKey: '', // 本地私钥地址，位置一般在C:/Users/xxx/.ssh/id_rsa，非必填，有私钥则配置
	passphrase: '', // 本地私钥密码，非必填，有私钥则配置
	projectName: '', // 项目名称
	// 根据需要进行配置，如只需部署prod线上环境，请删除dev测试环境配置，反之亦然，支持多环境部署
	prod: {
		// 线上环境
		name: '线上',
		script: 'npm run build', // 测试环境打包脚本
		host: '118.196.24.134', // 测试服务器地址
		port: 22, // ssh port，一般默认22
		username: 'root', // 登录服务器用户名
		password: 'Yzw337699..', // 登录服务器密码
		distPath: 'dist', // 本地打包dist目录
		webDir: '/opt/1panel/www/sites/118.196.24.134/index' // // 正式环境服务器地址
	}
	// 再还有多余的环境按照这个格式写即可
}
