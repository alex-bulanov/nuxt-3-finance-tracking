<script setup lang="ts">
import type { Transaction } from '~/types/Transation'
import { TypeTransaction } from '~/types/TypeTransaction'

interface Props {
	date: string | number
	transactions: Transaction[]
}

const props = defineProps<Props>()

const sum = computed(() => {
	return props.transactions.reduce((sum, transaction) => {
		if (transaction.type === TypeTransaction.INCOME) {
			sum += transaction.amount ? transaction.amount : 0
		} else {
			sum -= transaction.amount ? transaction.amount : 0
		}

		return sum
	}, 0)
})

const { currency } = useCurrency(sum)
</script>

<template>
	<div class="[&:not(:last-child)]:border-b border-gray-200 dark:border-gray-800 py-2">
		<div class="flex space-x-4 text-gray-600 dark:text-gray-400">
			<div class="w-1/2 flex justify-between items-center">
				<p class="text-sm font-semibold font-mono">{{ date }}</p>
			</div>
			<div class="w-1/2 flex justify-end items-center">
				<p class="text-sm font-semibold font-mono">{{ currency }}</p>
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
