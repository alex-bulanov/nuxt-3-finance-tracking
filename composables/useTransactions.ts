import type { Transaction } from '~/types/Transation'
import { TypeTransaction } from '~/types/TypeTransaction'

export function useTransactions(period: ComputedRef<{ from: Date; to: Date }> | undefined) {
	const supabase = useSupabaseClient()

	const transactions = ref<Transaction[]>([])
	const pending = ref<boolean>(false)

	const incomes = computed(() => transactions.value.filter(t => t.type === TypeTransaction.INCOME))
	const expenses = computed(() => transactions.value.filter(t => t.type === TypeTransaction.EXPENSES))

	const incomesCount = computed(() => incomes.value.length)
	const expensesCount = computed(() => expenses.value.length)

	const incomesTotal = computed(() => incomes.value.reduce((sum, t) => sum + Number(t.amount), 0))
	const expensesTotal = computed(() => expenses.value.reduce((sum, t) => sum + Number(t.amount), 0))

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

	const fetchTransactions = async () => {
		pending.value = true
		if (!period) return []

		try {
			const { data } = await useAsyncData(
				`transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
				async () => {
					const { data, error } = await supabase
						.from('transactions')
						.select()
						.gte('created_at', period.value.from.toISOString())
						.lte('created_at', period.value.to.toISOString())
						.order('created_at', { ascending: false })

					if (error || !data) return []

					return data
				}
			)
			return data.value ?? []
		} finally {
			pending.value = false
		}
	}

	const refreshTransactions = async () => (transactions.value = await fetchTransactions())

	watch(
		() => period,
		async () => {
			await refreshTransactions()
		},
		{ deep: true }
	)

	return {
		transactions,
		transactionsGroupedByDate,
		incomes,
		expenses,
		incomesCount,
		expensesCount,
		incomesTotal,
		expensesTotal,
		pending,
		refreshTransactions
	}
}
