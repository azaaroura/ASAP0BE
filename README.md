# ASAP Backend Sync Service

This backend service exposes REST endpoints for the Flutter app and connects to SQL Server using secure environment configuration.

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create `.env` from `.env.example` and fill in your SQL Server credentials.

3. Start the service:

   ```bash
   npm start
   ```

## API Endpoints

- `GET /api/status`
- `GET /api/clients`
- `GET /api/items`
- `GET /api/categories`
- `POST /api/clients`
- `POST /api/items`
- `POST /api/categories`
- `POST /api/transactions`
- `POST /api/visits`
- `POST /api/receipts`

## Notes

- Do not commit `.env` to source control.
- Use the backend as the bridge between Flutter and SQL Server.
