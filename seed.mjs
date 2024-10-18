import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import 'dotenv/config'
import { categories } from './constants.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: { persistSession: false }
  }
)

// const {
//   data: { users },
//   error
// } = await supabase.auth.admin.listUsers()

// if (error) {
//   console.log('Error: ', error)
// }

// const userIds = users.map(user => user.id)

async function seedTransactions() {
  // Удаление всех транзакций из базы данных

  const { error: deleteError } = await supabase
    .from('transactions')
    .delete()
    .gte('id', 0)

  if (deleteError) {
    console.error('Ошибка при удалении из базы данных: ', deleteError)
    return
  }

  const transactions = []

  // for (const user of userIds) {
    for (
      let year = new Date().getFullYear();
      year > new Date().getFullYear() - 2;
      year--
    ) {
      for (let i = 0; i < 15; i++) {
        const date = new Date(
          year,
          faker.number.int({ min: 0, max: 11 }),
          faker.number.int({ min: 1, max: 28 })
        )

        let type, category
        const typeBias = Math.random()

        if (typeBias < 0.85) {
          type = 'Expenses'
          category = faker.helpers.arrayElement(categories) // Category only for 'Expense'
        } else if (typeBias < 0.95) {
          type = 'Income'
        } else {
          type = faker.helpers.arrayElement(['Saving', 'Investment'])
        }

        let amount
        switch (type) {
          case 'Income':
            amount = faker.number.int({ min: 2000, max: 5000 })
            break
          case 'Expenses':
            amount = faker.number.int({ min: 100, max: 1000 })
            break
          case 'Savings':
          case 'Investment':
            amount = faker.number.int({ min: 5000, max: 10000 })
            break
          default:
            amount = 0
        }

        const transaction = {
          created_at: date,
          amount,
          type,
          description: faker.lorem.sentence(),
          category: type === 'Expenses' ? category : null
        }

        transactions.push(transaction)
      }
    }
  // }

  const { error: insertError } = await supabase
    .from('transactions')
    .upsert(transactions)

  if (insertError) {
    console.error('Ошибка при вставке данных:', insertError)
  } else {
    console.log('Данные были успешно вставлены')
  }
}


seedTransactions().catch(console.error)
