<script setup lang="ts">
import { transactionViewOptions } from '~/constants'
import type { Transaction } from '~/types/Transation'

const viewSelected = ref(transactionViewOptions[1])

const supabase = useSupabaseClient()

const transactions = ref<Transaction[]>([])
const isLoading = ref<boolean>(false)

const fetchTransactions = async () => {
	isLoading.value = true
	try {
		const { data } = await useAsyncData('transactions', async () => {
			const { data, error } = await supabase.from('transactions').select()

			if (error || !data) return []

			return data
		})

		return data.value ?? []
	} finally {
		isLoading.value = false
	}
}

const refreshTransactions = async () => (transactions.value = await fetchTransactions())

const transactionsGroupedByDate = computed(() => {
	const grouped: { [key: string]: (typeof transactions.value)[0][] } = {}

	for (const transaction of transactions.value) {
		const date = new Date(transaction.created_at).toLocaleString('ru').split(',')[0]

		if (!grouped[date]) {
			grouped[date] = []
		}

		grouped[date].push(transaction)
	}

	return grouped
})

const handleDaleted = async () => {
	await refreshTransactions()
}

await refreshTransactions()
</script>

<template>
	<div>
		<UContainer>
			<section class="my-10">
				<div class="flex justify-between items-center">
					<div>
						<h2 class="text-xl font-semibold">
							<!-- Summary -->
							Итоговый отчет
						</h2>
					</div>
					<div>
						<USelectMenu v-model="viewSelected" :options="transactionViewOptions" />
					</div>
				</div>
			</section>

			<section class="my-10">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
					<TrendCard title="Доход" :amount="4000" :last-amount="3000" color="green" :loading="isLoading" />
					<TrendCard title="Расходы" :amount="4000" :last-amount="3000" color="red" :loading="isLoading" />
					<TrendCard
						title="Инвестиции"
						:amount="3000"
						:last-amount="8000"
						color="green"
						:loading="isLoading"
					/>
					<TrendCard title="Сбережения" :amount="4000" :last-amount="3000" color="red" :loading="isLoading" />
				</div>
			</section>

			<section class="my-10">
				<div v-if="!isLoading" class="grid grid-cols-1">
					<div v-for="(transactionsOnDay, date) in transactionsGroupedByDate" :key="date">
						<DailyTransactionSummaryCard :date="date" :transactions="transactionsOnDay" />
						<TransactionCard
							v-for="transaction in transactionsOnDay"
							:key="transaction.id"
							:transaction="transaction"
							:loading="isLoading"
							@deleted="handleDaleted"
						/>
					</div>
				</div>
				<div v-else>
					<USkeleton v-for="_ in 4" :key="_" class="h-8 w-full" />
				</div>
			</section>

			<section>Курс Валют ЦБ</section>
		</UContainer>
	</div>
</template>
