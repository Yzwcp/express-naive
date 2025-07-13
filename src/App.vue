<!--------------------------------
 - @Author:
 - @LastEditor:
 - @LastEditTime: 2023/12/16 18:49:42
 - @Email:
 -
 --------------------------------->

<template>
	<n-config-provider
		class="wh-full"
		:locale="zhCN"
		:date-locale="dateZhCN"
		:theme="appStore.isDark ? darkTheme : undefined"
		:theme-overrides="appStore.naiveThemeOverrides"
	>
		<router-view v-if="Layout" v-slot="{ Component, route: curRoute }">
			<component :is="Layout">
				<transition name="fade-slide" mode="out-in" appear>
					<KeepAlive :include="keepAliveNames">
						<component :is="Component" v-if="!tabStore.reloading" :key="curRoute.fullPath" />
					</KeepAlive>
				</transition>
			</component>

			<LayoutSetting v-if="layoutSettingVisible" class="fixed right-12 top-1/2 z-999" />
		</router-view>
	</n-config-provider>
</template>

<script setup>
import { LayoutSetting } from '@/components'
import { useAppStore, useTabStore } from '@/store'
import { darkTheme, dateZhCN, zhCN } from 'naive-ui'
import { layoutSettingVisible } from './settings'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import api from '@/api/index.js'
dayjs.locale('zh-cn') // 设置语言为中文
const layouts = new Map()
function getLayout(name) {
	// 利用map将加载过的layout缓存起来，防止重新加载layout导致页面闪烁
	if (layouts.get(name)) return layouts.get(name)
	const layout = markRaw(defineAsyncComponent(() => import(`@/layouts/${name}/index.vue`)))
	layouts.set(name, layout)
	return layout
}

const route = useRoute()
const appStore = useAppStore()
if (appStore.layout === 'default') appStore.setLayout('')
const Layout = computed(() => {
	if (!route.matched?.length) return null
	return getLayout(route.meta?.layout || appStore.layout)
})

const tabStore = useTabStore()
const keepAliveNames = computed(() => {
	return tabStore.tabs.filter((item) => item.keepAlive).map((item) => item.name)
})
if (import.meta.env.VITE_OPEN_ALIOSS === '1') {
	api.getFileDirect().then((res) => {
		appStore.setAliyunOssDirect(res.data)
	})
}

watchEffect(() => {
	appStore.setThemeColor(appStore.primaryColor, appStore.isDark)
})
</script>
