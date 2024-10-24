<script setup lang="ts">
useIsAuthenticated()
</script>

<template>
	<div class="min-h-[100svh] flex items-center">
		<div class="w-full">
			<UContainer>
				<UCard class="mx-auto sm:max-w-lg">
					<template #header>
						<p class="font-semibold text-center">Вход...</p>
					</template>
					<p>Пожалуйста, подождите, пока вы войдёте в систему.</p>
				</UCard>
			</UContainer>
		</div>
	</div>
</template>
