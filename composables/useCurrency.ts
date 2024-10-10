export function useCurrency(amount: Ref<number> | number) {
	const currency = computed<string>(() => {
		return new Intl.NumberFormat('ru-Ru', {
			style: 'currency',
			currency: 'RUB'
		}).format(isRef(amount) ? amount.value : amount)
	})

	return { currency }
}
