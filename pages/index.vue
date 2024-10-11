<script setup lang="ts">
import { transactionViewOptions } from '~/constants'
import type { Transaction } from '~/types/Transation'

const viewSelected = ref(transactionViewOptions[1])

const supabase = useSupabaseClient()

const transactions = ref<Transaction[]>([])

const { data, error, status } = useAsyncData('transactions', async () => {
	const { data, error } = await supabase.from('transactions').select()

	if (error) {
		return error
	}

	return data
})

if (error.value) {
	throw createError({
		statusCode: error.value.statusCode,
		statusMessage: error.value.statusMessage,
		fatal: true
	})
}

const isLoading = computed(() => status.value === 'pending')

if (data.value) {
	transactions.value = data.value as Transaction[]
}
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
					<TrendCard title="Доход" :amount="4000" :last-amount="3000" color="green" :loading="false" />
					<TrendCard title="Расходы" :amount="4000" :last-amount="3000" color="red" :loading="false" />
					<TrendCard title="Инвестиции" :amount="3000" :last-amount="8000" color="green" :loading="false" />
					<TrendCard title="Сбережения" :amount="4000" :last-amount="3000" color="red" :loading="false" />
				</div>
			</section>

			<section class="my-10">
				<div class="grid grid-cols-1">
					<TransactionCard
						v-for="transaction in transactions"
						:key="transaction.id"
						:transaction="transaction"
						:loading="isLoading"
					/>
				</div>
			</section>

			<section>Курс Валют ЦБ</section>
		</UContainer>
	</div>
</template>
