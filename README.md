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

### Sync Endpoints
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

### Admin Management Endpoints

Built on existing database tables: `tbMobileClient`, `tbMobileItem`, `tbMobilePriceLevel`, `tbMobileItemPrice`, `tbMobileItemUnit`, `tbMobileZone`

**Clients:**
- `GET /api/admin/clients` - List clients
- `GET /api/admin/clients/{id}` - Get client details
- `POST /api/admin/clients` - Create/Update client
- `DELETE /api/admin/clients/{id}` - Delete client

**Items:**
- `GET /api/admin/items` - List items with categories
- `GET /api/admin/items/{id}` - Get item details
- `POST /api/admin/items` - Create/Update item
- `DELETE /api/admin/items/{id}` - Delete item

**Price Levels:**
- `GET /api/admin/price-levels` - List price levels
- `GET /api/admin/price-levels/{id}` - Get price level details
- `POST /api/admin/price-levels` - Create/Update price level

**Price Level Items:**
- `GET /api/admin/price-levels/{id}/items` - Get items in price level with prices
- `POST /api/admin/price-levels/{id}/items` - Add/Update item price in level
- `DELETE /api/admin/price-levels/{levelId}/items/{itemId}/{unitId}` - Remove item from level

**Zones (Warehouse Locations):**
- `GET /api/admin/zones` - List zones
- `POST /api/admin/zones` - Create/Update zone

**Stock Management:**
- `GET /api/admin/stock` - List all stock quantities
- `GET /api/admin/stock/item/{itemId}` - Get stock for specific item
- `POST /api/admin/stock` - Add/Update stock quantities
- `PUT /api/admin/stock/{itemId}/{unitId}/{loginName}/adjust` - Adjust stock quantities


For detailed API documentation and examples, see:
- [ADMIN_API.md](./ADMIN_API.md) - Complete endpoint reference
- [ADMIN_EXAMPLES.md](./ADMIN_EXAMPLES.md) - Working examples and workflows
