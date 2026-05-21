import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

// Standard visual formatting helper
function printHeader(title: string) {
  console.log('\n==================================================')
  console.log(`🔒 ${title.toUpperCase()}`)
  console.log('==================================================')
}

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close()
      resolve(ans.trim())
    })
  )
}

async function main() {
  printHeader('E-Store Admin Creation Utility')

  // Read arguments from command line if provided
  // e.g. npm run create-admin "Aditya" "aditya@design.com" "securepassword"
  let name = process.argv[2]
  let email = process.argv[3]
  let password = process.argv[4]

  if (!name || !email || !password) {
    console.log('💡 Tip: You can also pass credentials as arguments:')
    console.log('   npm run create-admin "<name>" "<email>" "<password>"\n')

    if (!name) {
      name = await askQuestion('👤 Enter Administrator Name: ')
      if (!name) {
        console.error('❌ Error: Administrator Name is required.')
        process.exit(1)
      }
    }

    if (!email) {
      email = await askQuestion('✉️  Enter Administrator Email: ')
      if (!email) {
        console.error('❌ Error: Administrator Email is required.')
        process.exit(1)
      }
    }

    if (!password) {
      password = await askQuestion('🔑 Enter Administrator Password: ')
      if (!password) {
        console.error('❌ Error: Administrator Password is required.')
        process.exit(1)
      }
    }
  }

  const normalizedEmail = email.toLowerCase().trim()

  try {
    console.log('\n⌛ Connecting to database and saving admin profile...')

    // Upsert or create admin user in database
    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name,
        password,
        role: 'admin',
        provider: 'credentials'
      },
      create: {
        name,
        email: normalizedEmail,
        password,
        role: 'admin',
        provider: 'credentials'
      }
    })

    console.log('==================================================')
    console.log('✅ ADMINISTRATOR CREATED SUCCESSFULLY!')
    console.log('==================================================')
    console.log(`👤 Name:     ${user.name}`)
    console.log(`✉️  Email:    ${user.email}`)
    console.log(`👑 Role:     ${user.role.toUpperCase()}`)
    console.log(`🔑 Password: [SECURED]`)
    console.log('==================================================')
    console.log('💡 You can now log into the Administrator Gateway')
    console.log('   using either your name or email as the username!\n')

  } catch (error) {
    console.error('❌ Failed to register administrative user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
