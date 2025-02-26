// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcryptjs = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  // Create test user
  const hashedPassword = await bcryptjs.hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      storeName: 'Test Store',
      mobileNumber: '1234567890',
      apiKey: 'test_api_key_12345'
    },
  })

  // Create test merchant
  await prisma.merchant.create({
    data: {
      userId: user.id,
      merchantType: 'HDFC',
      merchantId: 'HDFC123',
      merchantName: 'HDFC SmartHub',
      upiId: 'teststore@hdfc',
      isActive: true
    },
  })

  // Create test transactions
  const statuses = ['SUCCESS', 'FAILED', 'CREATED']
  const amounts = [100, 500, 1000, 1500, 2000]

  for (let i = 0; i < 10; i++) {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        pInfo: `Test Product ${i}`,
        customerName: `Customer ${i}`,
        customerEmail: `customer${i}@example.com`,
        customerMobile: `123456789${i}`,
        redirectUrl: 'https://example.com/return',
        merchantName: 'HDFC SmartHub',
        upiId: 'teststore@hdfc',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        transactionId: `TXN${Date.now()}${i}`
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })