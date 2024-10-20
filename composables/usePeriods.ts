import { sub, startOfYear, endOfYear, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns'

export function usePeriods(period: Ref<{ name: string; value: string }>) {
	const current = computed<{ from: Date; to: Date } | undefined>(() => {
		switch (period.value.value) {
			case 'Year':
				return {
					from: startOfYear(new Date()),
					to: endOfYear(new Date())
				}
			case 'Month':
				return {
					from: startOfMonth(new Date()),
					to: endOfMonth(new Date())
				}
			case 'Day':
				return {
					from: startOfDay(new Date()),
					to: endOfDay(new Date())
				}
		}
	})

	const previous = computed<{ from: Date; to: Date } | undefined>(() => {
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
		}
	})

	return { current, previous }
}
