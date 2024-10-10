<script setup lang="ts">
interface Props {
	title: string
	amount: number
	lastAmount: number
	color: string
	loading: boolean
}

const props = defineProps<Props>()

const isUp = computed<boolean>(() => props.amount >= props.lastAmount)

const icon = computed<string>(() =>
	isUp.value ? 'i-heroicons-arrow-trending-up-16-solid' : 'i-heroicons-arrow-trending-down-16-solid'
)

const percentage = computed(() => {
	if (props.amount === 0 || props.lastAmount === 0) return '∞%'

	const bigger = Math.max(props.amount, props.lastAmount)
	const lower = Math.min(props.amount, props.lastAmount)

	return `${Math.ceil(((bigger - lower) / lower) * 100)}%`
})

const { currency } = useCurrency(props.amount)
</script>

<template>
	<div>
		<div>
			<p class="font-semibold" :class="[color]">{{ title }}</p>
		</div>
		<div class="my-2">
			<USkeleton v-if="loading" class="w-full h-8" />
			<p v-else class="text-2xl font-bold text-black dark:text-white">{{ currency }}</p>
		</div>
		<div>
			<USkeleton v-if="loading" class="w-full h-6" />
			<div v-else class="flex items-center space-x-2">
				<UIcon class="w-6 h-6" :class="{ red: !isUp, green: isUp }" :name="icon" />
				<!-- " vs last period " -->
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{{ percentage }} по сравнению с предыдущим периодом
				</p>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.green {
	@apply text-green-600 dark:text-green-400;
}

.red {
	@apply text-red-600 dark:text-red-400;
}
</style>
