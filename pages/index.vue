<script setup lang="ts">
import { transactionViewOptions } from '~/constants'

const viewSelected = ref(transactionViewOptions[1])
</script>

<template>
	<div>
		<UContainer>
			<section class="my-10">
				<div class="flex justify-between items-center">
					<div>
						<h2 class="text-xl font-semibold">Summary</h2>
					</div>
					<div>
						<USelectMenu v-model="viewSelected" :options="transactionViewOptions" />
					</div>
				</div>
			</section>

			<section></section>

			<section></section>

			<section></section>
		</UContainer>
	</div>
</template>
