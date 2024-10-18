<script setup lang="ts">
import type { Transaction } from '~/types/Transation'
import { TypeTransaction } from '~/types/TypeTransaction'

interface Props {
	transaction: Transaction
	loading: boolean
}

const props = defineProps<Props>()
const emits = defineEmits<{
	(e: 'deleted', id: number): void
}>()

const isLoading = ref<boolean>(false)

const toast = useToast()
const supabase = useSupabaseClient()
const { currency } = useCurrency(props.transaction.amount || 0)

const deleteTransaction = async () => {
	isLoading.value = true
	try {
		await supabase.from('transactions').delete().eq('id', props.transaction.id)

		toast.add({
			title: 'Запись успешно удалена',
			icon: 'i-heroicons-check-circle-16-solid',
			color: 'green'
		})

		emits('deleted', props.transaction.id)
	} catch (error) {
		toast.add({
			title: 'Ошибка',
			icon: 'i-heroicons-exclamation-circle-16-solid',
			color: 'red'
		})
	} finally {
		isLoading.value = false
	}
}

const items = [
	[
		{
			label: 'Редактировать',
			icon: 'i-heroicons-pencil-16-solid',
			iconClass: 'text-gray-600 dark:text-white',
			click: () => console.log('Редактировать')
		},
		{
			label: 'Удалить',
			icon: 'i-heroicons-trash-16-solid',
			class: 'hover:bg-red-50 dark:hover:bg-red-400',
			iconClass: 'text-red-600 dark:text-white',
			click: () => deleteTransaction()
		}
	]
]

const isUp = computed<boolean>(() => props.transaction.type === TypeTransaction.INCOME)

const icon = computed<string>(() =>
	props.transaction.type === TypeTransaction.INCOME
		? 'i-heroicons-arrow-up-right-16-solid'
		: 'i-heroicons-arrow-down-left-16-solid'
)
</script>

<template>
	<div class="[&:not(:last-child)]:border-b border-gray-200 dark:border-gray-800 py-2">
		<div class="grid grid-cols-8 gap-4">
			<div class="col-span-5 flex justify-between items-center space-x-2">
				<div class="flex items-center space-x-1 truncate">
					<UIcon class="shrink-0 mt-1 w-6 h-6" :class="{ red: !isUp, green: isUp }" :name="icon" />
					<span class="text-sm font-semibold truncate">{{ transaction.description }}</span>
				</div>

				<UBadge v-if="transaction.category" color="white">{{ transaction.category }}</UBadge>
			</div>
			<div class="col-span-3 flex justify-between items-center space-x-2">
				<div class="shrink-0 grow text-end font-mono">{{ currency }}</div>

				<UDropdown :items="items" mode="click" :popper="{ placement: 'bottom-start' }">
					<UButton
						truncate
						icon="i-heroicons-cog-16-solid"
						class="w-full"
						color="white"
						variant="ghost"
						:loading="isLoading"
					/>
				</UDropdown>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.green {
	@apply text-green-600 dark:text-green-400;
}

.red {
	@apply text-red-600 dark:text-red-400;
}
</style>
