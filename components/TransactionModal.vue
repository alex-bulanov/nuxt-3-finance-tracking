<script setup lang="ts">
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

			<div>hello</div>
		</UCard>
	</UModal>
</template>
