<script setup lang="ts">
interface Props {
	title: string
	amount: number
	lastAmount: number
	color: string
	loading: boolean
}

defineProps<Props>()
</script>

<template>
	<div>
		<div>
			<p class="font-semibold" :class="[color]">{{ title }}</p>
		</div>
		<div class="my-2">
			<USkeleton v-if="loading" class="w-full h-8" />
			<p v-else class="text-2xl font-bold text-black dark:text-white">{{ amount }}</p>
		</div>
		<div>
			<USkeleton v-if="loading" class="w-full h-6" />
			<div v-else class="flex items-center space-x-2">
				<UIcon class="w-6 h-6" :class="[color]" name="i-heroicons-arrow-trending-up-16-solid" />
				<p class="text-sm text-gray-600 dark:text-gray-400">30% vs last period</p>
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
