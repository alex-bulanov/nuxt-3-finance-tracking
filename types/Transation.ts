export interface Transaction {
	id: number
	created_at: string
	amount: number | null
	type: string | null
	description: string | null
	category: string | null
}
