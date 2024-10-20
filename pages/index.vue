<script setup lang="ts">
import { periods } from '~/constants'

const isOpen = ref(false)
const selected = ref(periods[1])

const { current, previous } = usePeriods(selected)

const {
	pending: isLoading,
	refreshTransactions,
	incomesCount,
	expensesCount,
	incomesTotal,
	expensesTotal,
	transactionsGroupedByDate
} = useTransactions(current)

const { incomesTotal: prevIncomesTotal, expensesTotal: prevExpensesTotal } = useTransactions(previous)

const handleDeleted = async () => {
	await refreshTransactions()
}

const handleSaved = async () => {
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
						<USelectMenu v-model="selected" :options="periods" option-attribute="name" />
					</div>
				</div>
			</section>

			<section class="my-10">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
					<TrendCard
						title="Доход"
						:amount="incomesTotal"
						:last-amount="prevIncomesTotal"
						color="green"
						:loading="isLoading"
					/>
					<TrendCard
						title="Расходы"
						:amount="expensesTotal"
						:last-amount="prevExpensesTotal"
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
						<UButton
							class="md:px-6"
							square
							color="white"
							size="xl"
							:ui="{ rounded: 'rounded-full' }"
							@click="isOpen = true"
						>
							<UIcon class="w-6 h-6 md:hidden" name="i-heroicons-plus-16-solid" />
							<span class="hidden md:block pb-1 text-lg font-semibold">Новая операция</span>
						</UButton>

						<TransactionModal v-model="isOpen" @saved="handleSaved" />
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
							@deleted="handleDeleted"
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
