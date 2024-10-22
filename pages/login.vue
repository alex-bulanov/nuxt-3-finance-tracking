<script setup lang="ts">
definePageMeta({
	layout: 'empty'
})

const isSuccess = ref<boolean>(true)
</script>

<template>
	<div class="min-h-[100svh] flex items-center">
		<div class="w-full">
			<UContainer>
				<UCard v-if="!isSuccess" class="mx-auto sm:max-w-lg">
					<template #header>
						<p class="font-semibold text-center">Добро Пожаловать!</p>
					</template>

					<SignInForm />
				</UCard>
				<UCard v-else class="mx-auto sm:max-w-lg">
					<template #header>
						<p class="font-semibold text-center">Электронное письмо было отправлено</p>
					</template>

					<div class="text-center">
						<p class="mb-4">
							Мы отправили электронное письмо на адрес <strong>{{ 'email' }}</strong> со ссылкой для входа
						</p>
						<p><strong>Внимание: </strong> Срок действия ссылки истечет через 5 минут.</p>
					</div>
				</UCard>
			</UContainer>
		</div>
	</div>
</template>
