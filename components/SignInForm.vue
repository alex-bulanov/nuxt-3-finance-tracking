<script setup lang="ts">
import * as Yup from 'yup'
import type { FormErrorEvent } from '#ui/types'

const emits = defineEmits<{
	(e: 'submit-success', email: string): void
	(e: 'submit-failure'): void
}>()

const isLoading = ref<boolean>(false)
const formRef = ref()

const supabase = useSupabaseClient()
const toast = useToast()

interface FormState {
	email: string | undefined
}

const initialState = {
	email: undefined
}

const state = reactive<FormState>({
	...initialState
})

const schema = Yup.object({
	email: Yup.string().required('Обязательное поле').email('Некорректный email')
})

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
		const { error } = await supabase.auth.signInWithOtp({
			email: state.email!,
			options: {
				emailRedirectTo: 'http://localhost:3000/confirm/'
			}
		})

		if (error) {
			throw error
		}
		emits('submit-success', state.email!)
	} catch (error: any) {
		if (error.statusCode === 422) {
			handleError(error)
		} else {
			toast.add({
				title: 'Ошибка',
				icon: 'i-heroicons-exclamation-circle-16-solid',
				description: error.message,
				color: 'red'
			})
		}
		emits('submit-failure')
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
	<UForm ref="formRef" :schema="schema" :state="state" class="vacancy-form" @error="onError" @submit="onSubmit">
		<UFormGroup
			label="Email"
			name="email"
			:required="true"
			help="Вы получите электронное письмо со ссылкой для подтверждения"
		>
			<UInput v-model="state.email" size="xl" :disabled="isLoading" />
		</UFormGroup>

		<div class="mt-6">
			<UButton
				block
				class="w-full sm:mx-auto sm:w-auto sm:min-w-40"
				size="xl"
				label="Войти"
				variant="solid"
				type="submit"
				:loading="isLoading"
				:disabled="isLoading"
			/>
		</div>
	</UForm>
</template>
