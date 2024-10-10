<script setup lang="ts">
import { transactionViewOptions } from '~/constants'

const viewSelected = ref(transactionViewOptions[1])
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
					<!-- "Income/Доход" "Expenses/Расходы" "Investment/Инвестиции" "Savings/Сбережения"  -->
					<TrendCard title="Доход" :amount="4000" :last-amount="3000" color="green" :loading="false" />
					<TrendCard title="Расходы" :amount="4000" :last-amount="3000" color="red" :loading="false" />
					<TrendCard title="Инвестиции" :amount="3000" :last-amount="8000" color="green" :loading="false" />
					<TrendCard title="Сбережения" :amount="4000" :last-amount="3000" color="red" :loading="false" />
				</div>
			</section>

			<section class="my-10">
				<div class="grid grid-cols-1">
					<TransactionCard />
					<TransactionCard />
					<TransactionCard />
					<TransactionCard />
				</div>
			</section>

			<section></section>
		</UContainer>
	</div>
</template>
