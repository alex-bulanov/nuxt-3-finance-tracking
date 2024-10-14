<script setup lang="ts">
import { transactionViewOptions } from '~/constants'
import { TypeTransaction } from '~/types/TypeTransaction'
import type { Transaction } from '~/types/Transation'

const viewSelected = ref(transactionViewOptions[1])

const supabase = useSupabaseClient()

const transactions = ref<Transaction[]>([])
const isLoading = ref<boolean>(false)

const incomes = computed(() => transactions.value.filter(t => t.type === TypeTransaction.INCOME))
const expenses = computed(() => transactions.value.filter(t => t.type === TypeTransaction.EXPENSES))

const incomesCount = computed(() => incomes.value.length)
const expensesCount = computed(() => expenses.value.length)

const incomesTotal = computed(() => incomes.value.reduce((sum, t) => sum + Number(t.amount), 0))
const expensesTotal = computed(() => expenses.value.reduce((sum, t) => sum + Number(t.amount), 0))

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
					<TrendCard
						title="Доход"
						:amount="4000"
						:last-amount="incomesTotal"
						color="green"
						:loading="isLoading"
					/>
					<TrendCard
						title="Расходы"
						:amount="4000"
						:last-amount="expensesTotal"
						color="red"
						:loading="isLoading"
					/>
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
				<div class="flex justify-between items-center space-x-4">
					<div>
						<h2 class="text-xl font-semibold">
							<!-- Transactions -->
							Операции
						</h2>
						<p class="text-gray-600 dark:text-gray-400">
							<!-- You have {{ incomesCount }} incomes and {{ expensesCount }} expenses this period -->
							За этот период у вас было {{ incomesCount }} доходов и {{ expensesCount }} расходов.
						</p>
					</div>
					<div>
						<UButton class="md:px-6" square color="white" size="xl" :ui="{ rounded: 'rounded-full' }">
							<UIcon class="w-6 h-6 md:hidden" name="i-heroicons-plus-16-solid" />
							<span class="hidden md:block pb-1 text-lg font-semibold">Новая операция</span>
						</UButton>
					</div>
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
