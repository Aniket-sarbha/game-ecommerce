This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Setup with Docker

This project uses PostgreSQL running in a Docker container. Follow these steps to set up the database on a new PC.

### Prerequisites

- Docker and Docker Compose installed
- The `games_backup.sql` file (or any of the backup variants: `games_backup_clean.sql`, `games_backup_no_bom.sql`, `games_backup_utf8.sql`)

### Setting Up the Database

1. **Start the PostgreSQL Docker container**:
   ```bash
   docker-compose up -d
   ```
   This will create and start a PostgreSQL container named `gameecommerce` with:
   - Database name: `games`
   - Username: `postgres`
   - Password: `postgres`
   - Port: `5432`

2. **Wait for the container to be ready** (usually takes 10-30 seconds):
   ```bash
   docker logs gameecommerce
   ```
   Look for "database system is ready to accept connections"

### Importing Database Backup

#### Method 1: Direct Import (Recommended)
```bash
# Copy the SQL backup file into the container
docker cp games_backup.sql gameecommerce:/tmp/games_backup.sql

# Import the backup into the database
docker exec -i gameecommerce psql -U postgres -d games -f /tmp/games_backup.sql
```

#### Method 2: Using Standard Input
```bash
# Import directly without copying file first
docker exec -i gameecommerce psql -U postgres -d games < games_backup.sql
```

#### Method 3: Interactive Method
```bash
# Connect to the container
docker exec -it gameecommerce bash

# Inside the container, import the backup
psql -U postgres -d games -f /tmp/games_backup.sql

# Exit the container
exit
```

### Verifying the Import

Check if tables were created successfully:
```bash
docker exec -it gameecommerce psql -U postgres -d games -c "\dt"
```

Check if data was imported:
```bash
docker exec -it gameecommerce psql -U postgres -d games -c "SELECT COUNT(*) FROM [your_table_name];"
```

### Troubleshooting

#### If you encounter encoding issues:
- Try using `games_backup_utf8.sql` instead
- Or use the clean version: `games_backup_clean.sql`

#### If import fails due to existing data:
```bash
# Reset the database (WARNING: This will delete all existing data)
docker exec -it gameecommerce psql -U postgres -d games -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Then retry the import
docker exec -i gameecommerce psql -U postgres -d games -f /tmp/games_backup.sql
```

#### If container is not running:
```bash
# Check container status
docker ps -a

# Start the container if it's stopped
docker-compose up -d

# Or restart if needed
docker-compose restart
```

### Quick One-Liner Setup
For a complete setup in one command:
```bash
docker-compose up -d && sleep 10 && docker cp games_backup.sql gameecommerce:/tmp/games_backup.sql && docker exec -i gameecommerce psql -U postgres -d games -f /tmp/games_backup.sql
```

### Database Connection Details
After successful setup, your application can connect to the database using:
- **Host**: `localhost` (or `127.0.0.1`)
- **Port**: `5432`
- **Database**: `games`
- **Username**: `postgres`
- **Password**: `postgres`

Make sure your `.env` or environment variables are configured accordingly.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
