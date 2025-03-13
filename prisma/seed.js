import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  try {
    // Read the JSON file
    const dataFilePath = path.join( 'data.json')
    const jsonData = fs.readFileSync(dataFilePath, 'utf8')
    const storeData = JSON.parse(jsonData)

    console.log(`Found ${storeData.length} stores to update`)

    // Update each store with its corresponding data
    for (const store of storeData) {
      await prisma.store.update({
        where: { id: store.id },
        data: {
          image: store.image,
          backgroundImage: store.backgroundimage,
          description: store.description
        }
      })
      console.log(`Updated store ID: ${store.id}`)
    }

    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
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