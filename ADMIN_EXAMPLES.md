# Admin API Working Examples

## Test Connection

```bash
curl http://localhost:3000/api/status
```

---

## CLIENT MANAGEMENT EXAMPLES

### List All Clients
```bash
curl http://localhost:3000/api/admin/clients
```

### Get Specific Client
```bash
curl http://localhost:3000/api/admin/clients/1001
```

### Create New Client
```bash
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{
    "ClientCode": "NEWCL001",
    "ClientName": "New Client Company",
    "AltClientName": "New Client Corp",
    "Address": "456 Oak Ave",
    "Phone": "555-0102",
    "Email": "contact@newclient.com",
    "Contact": "Jane Doe",
    "City": "Chicago",
    "State": "IL",
    "ZoneID": 2,
    "PriceLevelID": 1,
    "CreditLimit": 25000,
    "Active": 1,
    "LoginName": "salesman2"
  }'
```

### Update Existing Client
```bash
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -d '{
    "ClientID": 1001,
    "ClientCode": "C001",
    "ClientName": "ABC Company Updated",
    "AltClientName": "ABC Corp",
    "Address": "789 Pine St",
    "Phone": "555-0103",
    "Email": "newemail@abc.com",
    "Contact": "John Smith",
    "City": "New York",
    "State": "NY",
    "ZoneID": 1,
    "PriceLevelID": 2,
    "CreditLimit": 75000,
    "Active": 1,
    "LoginName": "salesman1"
  }'
```

### Delete Client
```bash
curl -X DELETE http://localhost:3000/api/admin/clients/1001
```

---

## ITEM MANAGEMENT EXAMPLES

### List All Items
```bash
curl http://localhost:3000/api/admin/items
```

### Get Specific Item
```bash
curl http://localhost:3000/api/admin/items/1
```

### Create New Item
```bash
curl -X POST http://localhost:3000/api/admin/items \
  -H "Content-Type: application/json" \
  -d '{
    "ItemCode": "NEWITEM001",
    "ItemName": "New Product",
    "AltItemName": "Alternative Product Name",
    "CategoryID": 5,
    "StockQty": 200,
    "Active": 1
  }'
```

### Update Existing Item
```bash
curl -X POST http://localhost:3000/api/admin/items \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 1,
    "ItemCode": "ITEM001",
    "ItemName": "Product A Updated",
    "AltItemName": "Updated Name",
    "CategoryID": 5,
    "StockQty": 250,
    "Active": 1
  }'
```

### Delete Item
```bash
curl -X DELETE http://localhost:3000/api/admin/items/1
```

---

## PRICE LEVEL EXAMPLES

### List All Price Levels
```bash
curl http://localhost:3000/api/admin/price-levels
```

### Get Specific Price Level
```bash
curl http://localhost:3000/api/admin/price-levels/1
```

### Create New Price Level
```bash
curl -X POST http://localhost:3000/api/admin/price-levels \
  -H "Content-Type: application/json" \
  -d '{
    "PriceLevel": "VIP Customer",
    "AltPriceLevel": "Premium Pricing",
    "CurrencyID": 1,
    "TTC": 0
  }'
```

### Update Price Level
```bash
curl -X POST http://localhost:3000/api/admin/price-levels \
  -H "Content-Type: application/json" \
  -d '{
    "PriceLevelID": 1,
    "PriceLevel": "Retail",
    "AltPriceLevel": "Regular Pricing",
    "CurrencyID": 1,
    "TTC": 1
  }'
```

---

## PRICE LEVEL ITEMS EXAMPLES

### Get Items in Price Level
```bash
curl http://localhost:3000/api/admin/price-levels/1/items
```

### Add Item to Price Level with Price
```bash
curl -X POST http://localhost:3000/api/admin/price-levels/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 1,
    "UnitID": 1,
    "Price": 24.99,
    "Disc": 5.00,
    "LoginName": "admin"
  }'
```

### Add Multiple Items to Price Level
```bash
# Item 2
curl -X POST http://localhost:3000/api/admin/price-levels/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 2,
    "UnitID": 1,
    "Price": 34.99,
    "Disc": 0,
    "LoginName": "admin"
  }'

# Item 3
curl -X POST http://localhost:3000/api/admin/price-levels/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 3,
    "UnitID": 2,
    "Price": 44.99,
    "Disc": 10.00,
    "LoginName": "admin"
  }'
```

### Update Item Price in Price Level
```bash
curl -X POST http://localhost:3000/api/admin/price-levels/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 1,
    "UnitID": 1,
    "Price": 27.99,
    "Disc": 3.00,
    "LoginName": "admin"
  }'
```

### Remove Item from Price Level
```bash
curl -X DELETE http://localhost:3000/api/admin/price-levels/1/items/1/1
```

---

## ZONE MANAGEMENT EXAMPLES

### List All Zones
```bash
curl http://localhost:3000/api/admin/zones
```

### Create New Zone
```bash
curl -X POST http://localhost:3000/api/admin/zones \
  -H "Content-Type: application/json" \
  -d '{
    "ZoneName": "South Zone",
    "AltZoneName": "Southern Region"
  }'
```

### Update Zone
```bash
curl -X POST http://localhost:3000/api/admin/zones \
  -H "Content-Type: application/json" \
  -d '{
    "ZoneID": 1,
    "ZoneName": "North Zone Updated",
    "AltZoneName": "Northern Region"
  }'
```

---

## STOCK MANAGEMENT EXAMPLES

### View All Stock
```bash
curl http://localhost:3000/api/admin/stock
```

### View Stock for Specific Item
```bash
curl http://localhost:3000/api/admin/stock/item/1
```

### Add Stock Record
```bash
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 1,
    "UnitID": 1,
    "AllWHStockQty": 500,
    "SubWHStockQty": 250,
    "SoldQty": 0,
    "LoginName": "salesman1"
  }'
```

### Update Stock Quantities
```bash
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 1,
    "UnitID": 1,
    "AllWHStockQty": 600,
    "SubWHStockQty": 300,
    "SoldQty": 50,
    "LoginName": "salesman1"
  }'
```

### Adjust Main Warehouse Stock (Receive Shipment)
```bash
curl -X PUT http://localhost:3000/api/admin/stock/1/1/salesman1/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "AdjustmentQty": 100,
    "Type": "all"
  }'
```

### Adjust Sub Warehouse Stock (Consume)
```bash
curl -X PUT http://localhost:3000/api/admin/stock/1/1/salesman1/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "AdjustmentQty": -50,
    "Type": "sub"
  }'
```

### Add Stock for Multiple Items
```bash
# Item 1, Unit 1, Salesman 1
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -d '{"ItemID": 1, "UnitID": 1, "AllWHStockQty": 500, "SubWHStockQty": 250, "SoldQty": 0, "LoginName": "salesman1"}'

# Item 1, Unit 2, Salesman 1
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -d '{"ItemID": 1, "UnitID": 2, "AllWHStockQty": 1000, "SubWHStockQty": 500, "SoldQty": 0, "LoginName": "salesman1"}'

# Item 2, Unit 1, Salesman 1
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -d '{"ItemID": 2, "UnitID": 1, "AllWHStockQty": 300, "SubWHStockQty": 150, "SoldQty": 0, "LoginName": "salesman1"}'

# Item 1, Unit 1, Salesman 2
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -d '{"ItemID": 1, "UnitID": 1, "AllWHStockQty": 400, "SubWHStockQty": 200, "SoldQty": 0, "LoginName": "salesman2"}'
```

---

## Real-World Workflow Example

### Scenario: Setup a new product and pricing

```bash
# 1. Create the product
curl -X POST http://localhost:3000/api/admin/items \
  -H "Content-Type: application/json" \
  -d '{
    "ItemCode": "PROD-NEW-001",
    "ItemName": "Premium Widget",
    "CategoryID": 5,
    "StockQty": 0,
    "Active": 1
  }'
# Response will have ItemID, let's say: 100

# 2. Add pricing for Retail (PriceLevelID=1)
curl -X POST http://localhost:3000/api/admin/price-levels/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 100,
    "UnitID": 1,
    "Price": 49.99,
    "Disc": 0,
    "LoginName": "admin"
  }'

# 3. Add pricing for Wholesale (PriceLevelID=2)
curl -X POST http://localhost:3000/api/admin/price-levels/2/items \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 100,
    "UnitID": 1,
    "Price": 39.99,
    "Disc": 5.00,
    "LoginName": "admin"
  }'

# 4. Add stock for salesman1
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 100,
    "UnitID": 1,
    "AllWHStockQty": 500,
    "SubWHStockQty": 250,
    "SoldQty": 0,
    "LoginName": "salesman1"
  }'

# 5. Add stock for salesman2
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -d '{
    "ItemID": 100,
    "UnitID": 1,
    "AllWHStockQty": 300,
    "SubWHStockQty": 150,
    "SoldQty": 0,
    "LoginName": "salesman2"
  }'

# 6. View all stock for the new product
curl http://localhost:3000/api/admin/stock/item/100
```

---

## JavaScript/Node.js Integration Examples

```javascript
const API = 'http://localhost:3000/api/admin';

// Get all clients
async function getClients() {
  const res = await fetch(`${API}/clients`);
  return res.json();
}

// Create new client
async function createClient(clientData) {
  const res = await fetch(`${API}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData)
  });
  return res.json();
}

// Get items for a category
async function getItems() {
  const res = await fetch(`${API}/items`);
  return res.json();
}

// Add item to price level
async function addItemPrice(priceLevelId, itemData) {
  const res = await fetch(`${API}/price-levels/${priceLevelId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  return res.json();
}

// Get stock for item
async function getItemStock(itemId) {
  const res = await fetch(`${API}/stock/item/${itemId}`);
  return res.json();
}

// Adjust stock
async function adjustStock(itemId, unitId, loginName, adjustmentQty, type = 'all') {
  const res = await fetch(`${API}/stock/${itemId}/${unitId}/${loginName}/adjust`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ AdjustmentQty: adjustmentQty, Type: type })
  });
  return res.json();
}

// Example usage
(async () => {
  // Get all clients
  const clients = await getClients();
  console.log('Clients:', clients);

  // Get all items
  const items = await getItems();
  console.log('Items:', items);

  // Create new client
  const newClient = await createClient({
    ClientCode: 'TESTCL',
    ClientName: 'Test Client',
    LoginName: 'testuser'
  });
  console.log('New client:', newClient);
})();
```

---

## Notes

- Replace `localhost:3000` with your actual server URL
- `LoginName` typically represents a salesman/user in the system
- Stock adjustments can be positive (receive) or negative (consume)
- Type "all" or "sub" determines which stock field is adjusted
