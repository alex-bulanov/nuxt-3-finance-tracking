import { sub, startOfYear, endOfYear, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns'

export function usePeriods(period: Ref<{ name: string; value: string }>) {
	const current = computed(() => {
		switch (period.value.value) {
			case 'Year':
				return {
					from: startOfYear(new Date()),
					to: new Date()
				}
			case 'Month':
				return {
					from: startOfMonth(new Date()),
					to: new Date()
				}
			case 'Day':
				return {
					from: startOfDay(new Date()),
					to: new Date()
				}
			default:
				return undefined
		}
	})

	const previous = computed(() => {
		switch (period.value.value) {
			case 'Year':
				return {
					from: startOfYear(sub(new Date(), { years: 1 })),
					to: endOfYear(sub(new Date(), { years: 1 }))
				}
			case 'Month':
				return {
					from: startOfMonth(sub(new Date(), { months: 1 })),
					to: endOfMonth(sub(new Date(), { months: 1 }))
				}
			case 'Day':
				return {
					from: startOfDay(sub(new Date(), { days: 1 })),
					to: endOfDay(sub(new Date(), { days: 1 }))
				}
			default:
				return undefined
		}
	})

	return { current, previous }
}
