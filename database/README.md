# Database Setup — SignEase Platform

This directory contains the database definitions, migrations, and docker orchestration for the PostgreSQL database.

## Schema Details
- **`schema.sql`**: Full DDL schema with UUID generation, foreign keys, and indexes
- **`seed-data.sql`**: Seed data with default Organization, Administrator, and Demo Sender accounts
- **`docker-compose.yml`**: Docker service definitions for PostgreSQL 15 & pgAdmin 4

---

## Running with Docker (Recommended)
Run PostgreSQL and pgAdmin with a single command:
```bash
docker compose up -d
```
- **PostgreSQL**: `localhost:5432` (User: `postgres`, Password: `postgres`, DB: `esign_db`)
- **pgAdmin 4**: [http://localhost:5050](http://localhost:5050) (Login: `admin@esign.com` / `admin`)

---

## Running with Local PostgreSQL
If PostgreSQL is installed locally on your Windows machine:
1. Run `setup-postgres.bat`, or
2. Execute manually:
   ```cmd
   psql -U postgres -c "CREATE DATABASE esign_db;"
   psql -U postgres -d esign_db -f schema.sql
   psql -U postgres -d esign_db -f seed-data.sql
   ```

