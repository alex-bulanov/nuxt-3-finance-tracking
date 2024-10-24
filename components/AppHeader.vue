<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const items = [
	[
		{
			label: '',
			slot: 'account',
			disabled: true
		}
	],
	[
		{
			label: 'Настройки',
			icon: 'i-heroicons-cog-8-tooth',
			click: () => navigateTo('/settings/profile')
		},
		{
			label: 'Выйти',
			icon: 'i-heroicons-arrow-left-on-rectangle',
			class: 'text-red-600 dark:text-white hover:bg-red-50 dark:hover:bg-red-400',
			iconClass: 'text-red-600 dark:text-white',
			click: async () => {
				await supabase.auth.signOut()
				return navigateTo('/login')
			}
		}
	]
]
</script>

<template>
	<header class="fixed top-0 left-0 z-50 w-full bg-white dark:bg-[#1c1b22] shadow-sm">
		<UContainer>
			<div class="flex justify-between items-center py-2">
				<div>
					<NuxtLink class="text-lg font-mono font-bold" to="/">Finance Tracking</NuxtLink>
				</div>
				<div>
					<UDropdown
						v-if="user"
						:items="items"
						:ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
					>
						<UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />

						<template #account="{}">
							<div class="text-left">
								<p class="font-medium text-gray-900 dark:text-white">
									{{ user.email }}
								</p>
							</div>
						</template>

						<template #item="{ item }">
							<UIcon class="w-5 h-5" :name="item.icon" />
							<span class="truncate">{{ item.label }}</span>
						</template>
					</UDropdown>
				</div>
			</div>
		</UContainer>
		<UDivider></UDivider>
	</header>
</template>
