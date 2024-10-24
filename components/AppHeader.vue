<script setup lang="ts">
const user = useSupabaseUser()

watch(
	user,
	() => {
		if (user) {
			console.log('Вы вошли в систему')
		}
	},
	{
		immediate: true
	}
)
</script>

<template>
	<header class="fixed top-0 left-0 z-50 w-full bg-white dark:bg-[#1c1b22] shadow-sm">
		<UContainer>
			<div class="flex justify-between items-center py-2">
				<div>
					<NuxtLink class="text-lg font-mono font-bold" to="/">Finance Tracking</NuxtLink>
				</div>
				<div>
					<UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
				</div>
			</div>
		</UContainer>
		<UDivider></UDivider>
	</header>
</template>
