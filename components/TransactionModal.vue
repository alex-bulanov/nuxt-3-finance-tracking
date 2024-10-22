<script setup lang="ts">
import * as Yup from 'yup'
import type { FormErrorEvent } from '#ui/types'

import { categories, transactions } from '~/constants'
import { TypeTransaction } from '~/types/TypeTransaction'

interface Props {
	modelValue: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
	(e: 'update:modelValue', modelValue: boolean): void
	(e: 'saved'): void
}>()

const supabase = useSupabaseClient()
const toast = useToast()

const model = computed({
	get() {
		return props.modelValue
	},
	set(newValue) {
		if (!newValue) resetForm()

		emits('update:modelValue', newValue)
	}
})

const isLoading = ref<boolean>(false)
const formRef = ref()

interface FormState {
	type: string | undefined
	amount: number | undefined
	created_at: string | undefined
	category: string | undefined
	description: string | undefined
}

const initialState = {
	type: undefined,
	amount: undefined,
	created_at: undefined,
	category: undefined,
	description: undefined
}

const state = reactive<FormState>({
	...initialState
})

const defaultSchema = Yup.object({
	type: Yup.string()
		.oneOf(
			[TypeTransaction.INCOME, TypeTransaction.EXPENSES, TypeTransaction.INVESTMENT, TypeTransaction.SAVINGS],
			'Пожалуйста, выберите тип'
		)
		.required(),
	amount: Yup.number()
		.positive('Сумма должна быть больше 0')
		.transform((value, originalValue) => {
			return originalValue === '' ? undefined : value
		})
		.nullable()
		.required('Обязательное поле'),
	created_at: Yup.string().required('Обязательное поле'),
	description: Yup.string().optional()
})

const expenseSchema = Yup.object({
	type: Yup.string().oneOf([TypeTransaction.EXPENSES]).required(),
	category: Yup.string()
		.oneOf([...categories], 'Пожалуйста, выберите категорию')
		.required('Обязательное поле')
})

const schema = Yup.lazy((value: any) => {
	switch (value.type) {
		case TypeTransaction.EXPENSES:
			return expenseSchema.concat(defaultSchema)

		default:
			return defaultSchema
	}
})

const handleAmountInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const regex = /^[0-9]*\.?[0-9]{0,2}$/

	let value = target.value

	value = value.replace(',', '.')

	if (!regex.test(value)) {
		target.value = value.slice(0, -1)
		return
	}

	if ((value.match(/\./g) || []).length > 1) {
		target.value = value.slice(0, -1)
		return
	}

	if (value.startsWith('.')) {
		value = '0' + value
	}

	if (value.startsWith('0') && value.length > 1 && !value.includes('.')) {
		value = '0.'
	}

	const parts = value.split('.')
	if (parts.length === 2 && parts[1].length > 2) {
		value = `${parts[0]}.${parts[1].slice(0, 2)}`
	}

	target.value = value
}

const resetForm = () => {
	Object.assign(state, initialState)
	formRef.value.clear()
}

const scrollToError = (path: string): void => {
	const element = document.querySelector(`[name="${path}"]`) as HTMLElement

	if (element) {
		const parent = element.parentElement

		if (parent) {
			parent.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}

		element.focus()
	}
}

const onSubmit = async () => {
	isLoading.value = true

	try {
		const { error } = await supabase.from('transactions').upsert({ ...state })

		if (error) {
			throw error
		}

		toast.add({
			title: 'Опрерация сохранена',
			icon: 'i-heroicons-check-circle-16-solid'
		})

		model.value = false
		emits('saved')
	} catch (error: any) {
		if (error.statusCode === 422) {
			handleError(error)
		} else {
			toast.add({
				title: 'Ошибка добавления операции',
				icon: 'i-heroicons-exclamation-circle-16-solid',
				description: error.message,
				color: 'red'
			})
		}
	} finally {
		isLoading.value = false
	}
}

const onError = (event: FormErrorEvent): void => {
	const path = event.errors[0].path
	scrollToError(path)
}

const handleError = (error: any): void => {
	if (error.data.data && error.data.data.errors) {
		const errorEntries = Object.entries(error.data.data.errors)

		formRef.value.setErrors(
			errorEntries.map(([key, value]: any) => ({
				message: value,
				path: key
			}))
		)

		const path = errorEntries[0][0]
		scrollToError(path)
	}
}
</script>

<template>
	<UModal v-model="model">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header> Создать транзакцию </template>

			<UForm
				ref="formRef"
				:schema="schema"
				:state="state"
				class="vacancy-form"
				@error="onError"
				@submit="onSubmit"
			>
				<div class="grid grid-cols-1 gap-2">
					<UFormGroup label="Тип транзакции" name="type" :required="true">
						<USelect
							v-model="state.type"
							:options="transactions"
							option-attribute="name"
							:disabled="isLoading"
						/>
					</UFormGroup>

					<UFormGroup label="Сумма" name="amount" :required="true">
						<UInput
							v-model.number="state.amount"
							size="md"
							name="amount"
							type="tel"
							placeholder=""
							:disabled="isLoading"
							@input="handleAmountInput"
						/>
					</UFormGroup>

					<UFormGroup label="Дата" name="created_at" :required="true">
						<UInput
							v-model="state.created_at"
							size="md"
							name="created_at"
							type="date"
							icon="i-heroicons-calendar-days-16-solid"
							placeholder=""
							:disabled="isLoading"
						/>
					</UFormGroup>

					<UFormGroup
						v-if="state.type === TypeTransaction.EXPENSES"
						label="Категория"
						name="category"
						:required="true"
					>
						<USelect v-model="state.category" :options="categories" :disabled="isLoading" />
					</UFormGroup>

					<UFormGroup label="Описание" name="description" hint="Необязательное">
						<UTextarea
							v-model="state.description"
							size="md"
							name="description"
							type="text"
							placeholder=""
							:disabled="isLoading"
						/>
					</UFormGroup>

					<div class="mt-6">
						<UButton
							block
							class="sm:mx-auto sm:w-auto sm:min-w-40"
							size="md"
							type="submit"
							label="Создать"
							:disabled="isLoading"
						/>
					</div>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>
