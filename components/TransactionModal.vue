<script setup lang="ts">
import { categories, transactions } from '~/constants'
interface Props {
	modelValue: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
	(e: 'update:modelValue', modelValue: boolean): void
}>()

const model = computed({
	get() {
		return props.modelValue
	},
	set(newValue) {
		emits('update:modelValue', newValue)
	}
})
</script>

<template>
	<UModal v-model="model">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header> Создать транзакцию </template>

			<div class="grid grid-cols-1 gap-2">
				<UFormGroup label="Тип транзакции" name="type" :required="true">
					<USelect :options="transactions" option-attribute="name" />
				</UFormGroup>

				<UFormGroup label="Сумма" name="amount" :required="true">
					<UInput size="md" name="amount" type="text" placeholder="" />
				</UFormGroup>

				<UFormGroup label="Дата" name="created_at" :required="true">
					<UInput
						size="md"
						name="created_at"
						type="date"
						icon="i-heroicons-calendar-days-16-solid"
						placeholder=""
					/>
				</UFormGroup>

				<UFormGroup label="Категория" name="category" :required="true">
					<USelect :options="categories" />
				</UFormGroup>

				<UFormGroup label="Описание" name="description" hint="Необязательное">
					<UTextarea size="md" name="description" type="text" placeholder="" />
				</UFormGroup>

				<div class="py-2">
					<UButton size="md" type="submit" label="Сохранить" />
				</div>
			</div>
		</UCard>
	</UModal>
</template>
