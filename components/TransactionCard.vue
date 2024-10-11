<script setup lang="ts">
import type { Transaction } from '~/types/Transation'

interface Props {
	transaction: Transaction
	loading: boolean
}

const props = defineProps<Props>()

const { currency } = useCurrency(props.transaction.amount || 0)

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
			click: () => console.log('Удалить')
		}
	]
]
</script>

<template>
	<div class="[&:not(:last-child)]:border-b border-gray-200 dark:border-gray-800 py-2">
		<div class="flex space-x-4">
			<div class="w-1/2 flex justify-between items-center space-x-2">
				<div class="flex items-center space-x-1 truncate">
					<UIcon class="text-green-600 shrink-0" name="i-heroicons-arrow-long-up-16-solid" />
					<span class="text-sm font-semibold truncate">{{ transaction.description }}</span>
				</div>

				<UBadge v-if="transaction.category" color="white">{{ transaction.category }}</UBadge>
			</div>
			<div class="w-1/2 flex justify-between items-center space-x-2">
				<div class="shrink-0 grow text-end">{{ currency }}</div>

				<UDropdown :items="items" mode="click" :popper="{ placement: 'bottom-start' }">
					<UButton truncate icon="i-heroicons-cog-16-solid" class="w-full" color="white" variant="ghost" />
				</UDropdown>
			</div>
		</div>
	</div>
</template>
