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
			@onSorter="onSorter"
			ref="$table"
			v-model:query-items="queryItems"
			:scroll-x="1200"
			:columns="columns"
			:get-data="loadTableData"
			@update:queryItems="onQueryItemsChange"
		>
			<n-input-group>
				<n-select
					size="small"
					class="w-80"
					@updateValue="onWeekChange"
					v-model:value="queryItems.time"
					label-field="date"
					value-field="value"
					:options="[{ date: '全部', value: '' }, ...allTimestampList]"
				/>
				<n-radio-group
					@updateValue="onWeekChange"
					size="small"
					v-model:value="queryItems.time"
					name="radiobuttongroup1"
				>
					<n-radio-button v-for="song in weekTimestampList" :key="song.date" :value="song.value" :label="song.date" />
				</n-radio-group>
			</n-input-group>
			<n-select
				size="small"
				class="w-120"
				@updateValue="onPlatformChange"
				v-model:value="queryItems.platform"
				:options="[{ label: '全部', value: '' }, ...dict[dictKey.TRADE_PLATFORM]]"
			/>
			<div class="f-c-c gap-x-10 text-18">
				<div class="f-c-c" title="盈利">
					<div class="f-c-c text-20" :class="analysis.income < 0 ? 'color-#D03084' : 'color-#316C72'">
						<i
							:class="
								analysis.income < 0
									? 'i-material-symbols:sentiment-dissatisfied-outline cursor-pointer'
									: 'i-material-symbols:sentiment-excited-outline cursor-pointer'
							"
						/>
						<span class="text-14 m-l-2 mt-1"> {{ analysis.income }}$ </span>
					</div>
				</div>
				<div class="color-gray-400">·</div>
				<div class="f-c-c" title="胜率">
					<i class="text-20 i-material-symbols:wine-bar-rounded cursor-pointer" />
					<span class="text-12"> {{ analysis.rating }}%</span>
				</div>
				<div class="color-gray-400">·</div>
				<div class="f-c-c" title="下单总数">
					<i class="text-20 i-material-symbols:database-outline cursor-pointer" />
					<span class="text-12"> {{ analysis.total }}</span>
				</div>
			</div>
		</MeCrud>
		<n-drawer
			default-width="80%"
			v-model:show="drawerShow"
			@afterLeave="editMode = false"
			:placement="'right'"
			:trap-focus="false"
			ref="drawerContentRef"
			resizable
			:block-scroll="false"
		>
			<n-drawer-content>
				<template #header>
					<n-space align="center">
						<n-tag :bordered="false" size="medium">
							<template #icon><i class="i-material-symbols:bookmarks"></i></template>
							{{ getDictLabel(dictKey.TRADE_ORDER_CODE, rowData.code) }}
						</n-tag>
						<n-tag type="error" size="medium" :bordered="false">
							<template #icon><i class="i-material-symbols:auto-graph"></i></template>
							{{ rowData.rating }}R
						</n-tag>

						<n-tag type="info" :bordered="false" size="medium">
							<template #icon
								><i
									:class="
										rowData.status === '1'
											? 'i-material-symbols:arrow-upload-ready'
											: 'i-material-symbols:arrow-upload-ready rotate-180'
									"
								></i
							></template>
							{{ getDictLabel(dictKey.TRADE_ORDER_STATUS, rowData.status) }}
						</n-tag>
						<n-tag type="success" size="medium" :bordered="false">
							<template #icon><i class="i-material-symbols:alarm-on"></i></template>
							{{ dayjs(rowData.orderTime).format('YYYY-MM-DD HH:MM dddd') }}
						</n-tag>
						<n-tag :bordered="false" size="medium">
							<template #icon><i class="i-material-symbols:home-storage"></i></template>
							{{ getDictLabel(dictKey.TRADE_PLATFORM, rowData.platform) }}
						</n-tag>
					</n-space>

					<div class="flex justify-between">
						<n-space class="m-y-10">
							<n-tag
								type="primary"
								v-for="(item, index) in rowData.tradingModelsCopy"
								:key="item.id"
								:bordered="false"
								size="medium"
							>
								{{ item.name }}
							</n-tag>
						</n-space>
						<div class="f-c-c gap-x-10">
							<n-button size="small" circle dashed @click="editHtml">
								<i class="i-material-symbols:edit-document"></i>
							</n-button>
							<n-button size="small" type="success" v-if="editMode" @click="onSave(rowData)" circle secondary>
								<i class="i-material-symbols:save"></i>
							</n-button>
						</div>
					</div>
				</template>
				<div>
					<Editor
						:editorStyle="{ height: 'calc(100vh - 250px)' }"
						ref="editRef"
						:text="rowData.content"
						:editMode="editMode"
					></Editor>
				</div>
			</n-drawer-content>
		</n-drawer>
		<MeModal></MeModal>
		<MeUpload @on-ok="getImage" ref="imageSpaceRef"></MeUpload>
	</CommonPage>
</template>

<script setup>
import { CommonPage, MeCrud, MeModal, MeQueryItem } from '@/components/index.js'
import { useCrud } from '@/composables/index.js'
import EditRow from '@/views/trade/list/components/EditRow.vue'
import { withPermission } from '@/directives/index.js'
import { dict, dictKey, formatDateTime, getDictLabel } from '@/utils/index.js'
import { NAvatar, NButton, NSwitch, NTag, NImage } from 'naive-ui'
import { MeUpload } from '@/components/index.js'
import api from './api.js'
import modelApi from '@/views/trade/poi/api.js'
import { cloneDeep } from 'lodash-es'
import Editor from '@/components/me/editor/index.vue'
import dayjs from 'dayjs'
import { getExtendedTimestamps, roundTo } from '@/utils/index.js'
import Decimal from 'decimal.js'
defineOptions({ name: 'TradeDiary' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const weekTimestampList = getExtendedTimestamps().weekdays.map((item) => ({
	...item,
	value: [item.start, item.end].join(',')
}))
const allTimestampList = getExtendedTimestamps().all.map((item) => ({
	...item,
	value: [item.start, item.end].join(',')
}))

let weekOptions = ref([])
const rang = ['1', '2', '3', '4', '5']
const imageSpaceRef = ref(null)
const drawerContentRef = ref(null)
const editorHeight = ref(500)
const editRef = ref(null)
const drawerShow = ref(false)
const rowData = ref({})
const poiList = ref([])
const editMode = ref(false)
const templateRow = ref({
	code: '1',
	killZone: '1',
	orderLabel: '',
	orderTime: undefined,
	profit: '',
	risk: '',
	platform: '3',
	remark: undefined,
	status: '1',
	enable: true,
	tradingModels: []
})
onMounted(() => {
	modelApi.read({}).then(
		(res) =>
			(poiList.value = res.data.map((item) => {
				return {
					label: item.name,
					value: item.id
				}
			}))
	)
	weekOptions.value = dict[dictKey.WEEK_RANG].filter((item) => rang.includes(item.value))
	weekOptions.value.unshift({
		label: '本周',
		value: '0'
	})
	$table.value?.handleSearch()
})
const analysis = computed(() => {
	let income = 0
	let win = 0
	let excluded = 0
	let tableData = $table?.value?.tableData
	if (tableData && tableData.length > 0) {
		tableData.forEach((item) => {
			if (item.income) income += Number(item.income)
			if (item.status === '1') win += 1
			if (item.status === '3') excluded += 1
		})
		const rating = Decimal(win).div(tableData.length).mul(100).trunc()
		return {
			income,
			//保留1位小数
			rating,
			total: tableData.length
		}
	} else {
		return {
			income: 0,
			rating: 0,
			total: 0
		}
	}
})

const getTodayValue = () => {
	const now = dayjs()
	const day = now.startOf('day').format('dddd')
	const startDay = now.startOf('day').valueOf()
	const endDay = now.endOf('day').valueOf()
	if (day === '星期日' || day === '星期六') {
		return allTimestampList[0].value
	} else {
		return [startDay, endDay].join(',')
	}
}
const queryItems = ref({
	time: getTodayValue(),
	platform: ''
})
const incomeCol = reactive({
	title: '收益',
	key: 'income',
	sorter: true,
	width: 100,
	align: 'center',
	render(row) {
		return h(EditRow, {
			value: row.income ? String(row.income) : '',
			onChangeValue: (v) => onEditRow(row, Number(v), 'income'),
			type: 'input',
			unit: '$',
			textClass: row.income < 0 ? 'color-#D03084' : 'color-#316C72'
		})
	}
})
const onSorter = (options, e) => {
	console.log(options, e)
	if (options.order) {
		let order = options.order === 'descend' ? 'desc' : 'asc'
		queryItems.value.order = options.columnKey + ':' + order
	} else {
		queryItems.value.order = 'createdAt:desc'
	}
	$table.value?.handleSearch()
}
const onQueryItemsChange = () => {
	// incomeCol.sortOrder = false
	// $table.value?.handleSearch()
}
const onWeekChange = (value) => {
	queryItems.value.time = value
	$table.value?.handleSearch()
}
const onPlatformChange = (value) => {
	queryItems.value.platform = value
	$table.value?.handleSearch()
}
const onDrawer = (row) => {
	rowData.value = cloneDeep(row)
	drawerShow.value = true
}

const editHtml = (row) => {
	editMode.value = !editMode.value
}

const loadTableData = (params) => {
	return api.read(params).then((res) => {
		res.data.pageData.forEach((item) => {
			item.tradingModelsCopy = cloneDeep(item.tradingModels)

			item.tradingModels = item.tradingModels.map((model) => model.id)
		})
		return res
	})
}
const onEditRow = (row, v, key) => {
	row.editable = true
	row[key] = v
	console.log(v, key)
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
		width: 120,
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
		width: 120,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.killZone,
				onChangeValue: (v) => onEditRow(row, v, 'killZone'),
				type: 'select',
				dictKey: dictKey.TRADE_KILL_ZONE
			})
		}
	},

	{
		title: '盈利',
		align: 'center',
		key: 'profit',
		width: 100,
		render(row) {
			return h(EditRow, {
				value: row.profit ? String(row.profit) : '',
				onChangeValue: (v) => onEditRow(row, Number(v), 'profit'),
				type: 'input',
				unit: '%'
			})
		}
	},
	{
		title: '风险',
		key: 'risk',
		width: 100,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.risk ? String(row.risk) : '',
				onChangeValue: (v) => onEditRow(row, Number(v), 'risk'),
				type: 'input',
				unit: '%'
			})
		}
	},
	incomeCol,
	{
		title: '状态',
		key: 'status',
		width: 120,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row.status,
				onChangeValue: (v) => onEditRow(row, v, 'status'),
				type: 'select',
				dictKey: dictKey.TRADE_ORDER_STATUS,
				render(v) {
					return h(
						NTag,
						{
							type: (() => {
								if (row.status === '1') {
									return 'success'
								} else if (row.status === '2') {
									return 'error'
								} else {
									return 'info'
								}
							})(),
							size: 'small',
							round: true
						},
						{
							default: () => getDictLabel(dictKey.TRADE_ORDER_STATUS, row.status)
						}
					)
				}
			})
		}
	},
	{
		title: 'POI',
		key: 'tradingModels',
		width: 150,
		align: 'center',
		render(row) {
			return h(EditRow, {
				value: row?.tradingModels || [],
				options: poiList.value,
				onChangeValue: (v) => onEditRow(row, v, 'tradingModels'),
				type: 'multiple'
			})
		}
	},
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
		title: '平台',
		key: 'platform',
		width: 120,
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
		title: '操作',
		key: 'actions',
		width: 80,
		align: 'center',
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
							circle: true,
							disabled: row.code === 'SUPER_ADMIN',
							onClick: () => onSave(cloneDeep({ ...row }))
						},
						{
							icon: () => h('i', { class: 'i-material-symbols:save text-14' })
						}
					),
				!row.editable &&
					h(
						NButton,
						{
							size: 'small',
							circle: true,
							onClick: () => onDrawer(cloneDeep({ ...row }))
						},
						{
							icon: () => h('i', { class: 'i-material-symbols:arrow-forward' })
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
	$table.value?.tableData.unshift(cloneDeep(templateRow.value))
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
function onSave(data) {
	if (editRef?.value) {
		data.content = editRef.value.getValue()
	}
	return handleSave({
		api: () => (data.id ? api.update(data) : api.create(data)),
		cb: () => {
			if (editRef.value) editHtml()
			$message.success('保存成功')
		}
	})
	// if (modalAction.value === 'setRole') {
	// 	return handleSave({
	// 		api: () => api.setRole(modalForm.value),
	// 		cb: () => $message.success('分配成功')
	// 	})
	// } else if (modalAction.value === 'reset') {
	// 	return handleSave({
	// 		api: () => api.resetPwd(modalForm.value.id, modalForm.value),
	// 		cb: () => $message.success('密码重置成功')
	// 	})
	// }
	// handleSave()
}
</script>
