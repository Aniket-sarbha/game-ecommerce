// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Read JSON files from a directory
  const dataDir = path.join(__dirname, '../data'); // Adjust this path as needed
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Create store
    const store = await prisma.store.create({
      data: {
        itemName: data.itemname.S,
        isActive: data.isactive.S.toLowerCase() === 'true',
      },
    });
    
    // Create store items
    for (const item of data.storeitems.L) {
      await prisma.storeItem.create({
        data: {
          productId: item.M.productid.S,
          name: item.M.name.S,
          price: parseFloat(item.M.price.S),
          mrp: parseFloat(item.M.mrp.S),
          img: item.M.img.S,
          isActive: item.M.isactive.S.toLowerCase() === 'true',
          storeId: store.id,
        },
      });
    }
    
    console.log(`Seeded data from ${file}`);
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