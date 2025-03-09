import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// Get directory path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Path to the directory containing JSON files
  const dataDir = path.join(__dirname, '../data'); // Adjust path as needed
  
  console.log('Starting database seeding...');
  
  try {
    // Read all files in the directory
    const files = fs.readdirSync(dataDir);
    
    // Process each JSON file
    for (const file of files) {
      if (file.endsWith('.json')) {
        console.log(`Processing ${file}...`);
        
        // Read and parse the JSON file
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        
        // Extract store name from itemname, stripping the "store-" prefix
        const storeName = data.itemname.S.replace('store-', '');
        const isActive = data.isactive.S === 'true';
        
        // Create or update the store
        const store = await prisma.store.upsert({
          where: { name: storeName },
          update: { isActive },
          create: {
            name: storeName,
            isActive
          }
        });
        
        console.log(`Store "${storeName}" processed`);
        
        // Process each store item
        if (data.storeitems && data.storeitems.L) {
          for (const item of data.storeitems.L) {
            const storeItem = item.M;
            const isItemActive = storeItem.isactive.S === 'true';
            
            await prisma.storeItem.upsert({
              where: { productId: storeItem.productid.S },
              update: {
                name: storeItem.name.S,
                price: storeItem.price.S,
                mrp: storeItem.mrp.S,
                image: storeItem.img?.S || null,
                isActive: isItemActive
              },
              create: {
                productId: storeItem.productid.S,
                name: storeItem.name.S,
                price: storeItem.price.S,
                mrp: storeItem.mrp.S,
                image: storeItem.img?.S || null,
                isActive: isItemActive,
                storeId: store.id
              }
            });
          }
        }
        
        console.log(`Processed ${data.storeitems?.L?.length || 0} items for ${storeName}`);
      }
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });