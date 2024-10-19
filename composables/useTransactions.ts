import type { Transaction } from '~/types/Transation'
import { TypeTransaction } from '~/types/TypeTransaction'

export function useTransactions() {
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
		try {
			const { data } = await useAsyncData('transactions', async () => {
				const { data, error } = await supabase
					.from('transactions')
					.select()
					.order('created_at', { ascending: false })

				if (error || !data) return []

				return data
			})

			return data.value ?? []
		} finally {
			pending.value = false
		}
	}

	const refreshTransactions = async () => (transactions.value = await fetchTransactions())

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
