# File Uploader

A personal cloud storage service for all sorts of files.

![App Screenshot](./screenshots/screenshot.png?raw=true)

## Features

- File Uploads & Downloads
- Folder Organization

## Prerequisites

- Node.js
- PostgreSQL
- Supabase account

## Installation

1. Fork and clone this repository

2. Install the dependencies

   ```bash
   npm install
   ```

3. Run the database migrations and generate Prisma Client with SQL flag

   ```bash
   npx prisma migrate dev
   npx prisma generate --sql
   ```

4. Set up Supabase and environment variables
   - In your Supabase project, create a **Storage bucket** named `files`.
   - Then configure your environment variables:

   ```env
    PORT=3000
    SESSION_SECRET=your-session-secret
    DATABASE_URL=postgresql://username:password@localhost:5432/database_name
    SUPABASE_URL=your-supabase-project-url
    SUPABASE_KEY=your-supabase-key
    SUPABASE_DOWNLOAD_URL_PREFIX=https://[project_id].supabase.co/storage/v1/object/public/files
   ```

5. Run the development server

   ```bash
   npm run dev
   ```

6. Open the app on [http://localhost:3000](http://localhost:3000)

## Contribute

- [Issue Tracker](https://github.com/LazyEllis/file-uploader/issues)
- [Source Code](https://github.com/LazyEllis/file-uploader)

## License

The project is licensed under the [MIT](LICENSE) License.
