// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	modules: [
		[
			'@nuxtjs/eslint-module',
			{
				lintOnStart: false,
				failOnError: true,
				cache: false
			}
		],
		[
			'@nuxtjs/stylelint-module',
			{
				lintOnStart: false,
				failOnError: true,
				cache: false
			}
		],
		'@nuxt/ui',
		'@nuxtjs/supabase'
	],

	css: ['~/assets/scss/main.scss'],

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					silenceDeprecations: ['legacy-js-api'],
					additionalData: `@use "@/assets/scss/general/variables.scss" as *;`
				}
			}
		}
	},

	supabase: {
		redirect: false
	}
})
