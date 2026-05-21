# Admin API Documentation - Using Existing Database Schema

## Overview

Complete admin management system built on existing database tables:
- `tbMobileClient` - Client management
- `tbMobileItem` - Product inventory  
- `tbMobilePriceLevel` - Price tiers
- `tbMobileItemPrice` - Item prices by tier
- `tbMobileItemUnit` - Stock quantities
- `tbMobileZone` - Zone/warehouse locations

**Base URL:** `/api/admin`

---

## Client Management

### Get All Clients
```
GET /api/admin/clients
```
Returns top 1000 clients sorted by name.

**Response:**
```json
[
  {
    "ClientID": 1001,
    "ClientCode": "C001",
    "ClientName": "ABC Company",
    "AltClientName": "ABC Corp",
    "Address": "123 Main St",
    "Phone": "555-0100",
    "Email": "info@abc.com",
    "Contact": "John Smith",
    "City": "New York",
    "State": "NY",
    "ZoneID": 1,
    "PriceLevelID": 1,
    "Balance": 5000,
    "CreditLimit": 50000,
    "Active": 1,
    "LoginName": "salesman1",
    "ModifiedDate": "2024-05-21T10:30:00Z"
  }
]
```

### Get Client Details
```
GET /api/admin/clients/{clientId}
```

### Create/Update Client
```
POST /api/admin/clients
Content-Type: application/json
```
**Body:**
```json
{
  "ClientID": 1001,
  "ClientCode": "C001",
  "ClientName": "ABC Company",
  "AltClientName": "ABC Corp",
  "Address": "123 Main St",
  "Phone": "555-0100",
  "Email": "info@abc.com",
  "Contact": "John Smith",
  "City": "New York",
  "State": "NY",
  "ZoneID": 1,
  "PriceLevelID": 1,
  "CreditLimit": 50000,
  "Active": 1,
  "LoginName": "salesman1"
}
```

### Delete Client
```
DELETE /api/admin/clients/{clientId}
```

---

## Item Management

### Get All Items
```
GET /api/admin/items
```
Returns top 1000 items with category information.

**Response:**
```json
[
  {
    "ItemID": 1,
    "ItemCode": "ITEM001",
    "ItemName": "Product A",
    "AltItemName": "Alternative Name",
    "CategoryID": 5,
    "CategoryName": "Electronics",
    "StockQty": 150,
    "Active": 1,
    "ModifiedDate": "2024-05-21T10:30:00Z"
  }
]
```

### Get Item Details
```
GET /api/admin/items/{itemId}
```

### Create/Update Item
```
POST /api/admin/items
Content-Type: application/json
```
**Body:**
```json
{
  "ItemID": 1,
  "ItemCode": "ITEM001",
  "ItemName": "Product A",
  "AltItemName": "Alternative Name",
  "CategoryID": 5,
  "StockQty": 150,
  "Active": 1
}
```

### Delete Item
```
DELETE /api/admin/items/{itemId}
```

---

## Price Level Management

### Get All Price Levels
```
GET /api/admin/price-levels
```

**Response:**
```json
[
  {
    "PriceLevelID": 1,
    "PriceLevel": "Retail",
    "AltPriceLevel": "Regular Pricing",
    "CurrencyID": 1,
    "TTC": 0,
    "ModifiedDate": "2024-05-21T10:30:00Z"
  },
  {
    "PriceLevelID": 2,
    "PriceLevel": "Wholesale",
    "AltPriceLevel": "Bulk Pricing",
    "CurrencyID": 1,
    "TTC": 0,
    "ModifiedDate": "2024-05-21T10:30:00Z"
  }
]
```

### Get Price Level Details
```
GET /api/admin/price-levels/{priceLevelId}
```

### Create/Update Price Level
```
POST /api/admin/price-levels
Content-Type: application/json
```
**Body:**
```json
{
  "PriceLevelID": 1,
  "PriceLevel": "Retail",
  "AltPriceLevel": "Regular Pricing",
  "CurrencyID": 1,
  "TTC": 0
}
```

---

## Price Level Items (Item Pricing)

### Get Items in Price Level
```
GET /api/admin/price-levels/{priceLevelId}/items
```

**Response:**
```json
[
  {
    "PriceLevelID": 1,
    "ItemID": 1,
    "UnitID": 1,
    "Price": 29.99,
    "Disc": 0,
    "ItemName": "Product A",
    "ItemCode": "ITEM001",
    "UnitCode": "BOX"
  }
]
```

### Add/Update Item Price in Price Level
```
POST /api/admin/price-levels/{priceLevelId}/items
Content-Type: application/json
```
**Body:**
```json
{
  "ItemID": 1,
  "UnitID": 1,
  "Price": 29.99,
  "Disc": 0,
  "LoginName": "admin"
}
```

### Remove Item from Price Level
```
DELETE /api/admin/price-levels/{priceLevelId}/items/{itemId}/{unitId}
```

---

## Warehouse Zones

### Get All Zones
```
GET /api/admin/zones
```

**Response:**
```json
[
  {
    "ZoneID": 1,
    "ZoneName": "North Zone",
    "AltZoneName": "Northern Region",
    "ModifiedDate": "2024-05-21T10:30:00Z"
  }
]
```

### Create/Update Zone
```
POST /api/admin/zones
Content-Type: application/json
```
**Body:**
```json
{
  "ZoneID": 1,
  "ZoneName": "North Zone",
  "AltZoneName": "Northern Region"
}
```

---

## Stock Management (Item Units)

### Get All Stock
```
GET /api/admin/stock
```
Returns stock quantities for all items/units across all users (top 1000).

**Response:**
```json
[
  {
    "ItemID": 1,
    "UnitID": 1,
    "AllWHStockQty": 500,
    "SubWHStockQty": 250,
    "SoldQty": 100,
    "LoginName": "salesman1",
    "ModifiedDate": "2024-05-21T10:30:00Z",
    "ItemName": "Product A",
    "ItemCode": "ITEM001",
    "UnitCode": "BOX"
  }
]
```

### Get Stock for Specific Item
```
GET /api/admin/stock/item/{itemId}
```

### Add/Update Stock
```
POST /api/admin/stock
Content-Type: application/json
```
**Body:**
```json
{
  "ItemID": 1,
  "UnitID": 1,
  "AllWHStockQty": 500,
  "SubWHStockQty": 250,
  "SoldQty": 100,
  "LoginName": "salesman1"
}
```

### Adjust Stock Quantity
```
PUT /api/admin/stock/{itemId}/{unitId}/{loginName}/adjust
Content-Type: application/json
```
**Body:**
```json
{
  "AdjustmentQty": 50,
  "Type": "all"
}
```
- `Type`: "all" = AllWHStockQty, "sub" = SubWHStockQty

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "error": "Description of error"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `500` - Server Error

---

## Database Tables Reference

### tbMobileClient
- **PK:** ClientID, LoginName
- **Key Fields:** ClientCode, ClientName, Address, Phone, Email, PriceLevelID, Balance

### tbMobileItem
- **PK:** ItemID
- **Key Fields:** ItemCode, ItemName, CategoryID, StockQty

### tbMobilePriceLevel
- **PK:** PriceLevelID
- **Key Fields:** PriceLevel, CurrencyID, TTC

### tbMobileItemPrice
- **PK:** ItemID, PriceLevelID, UnitID
- **Key Fields:** Price, Disc

### tbMobileItemUnit
- **PK:** ItemID, LoginName, UnitID
- **Key Fields:** AllWHStockQty, SubWHStockQty, SoldQty

### tbMobileZone
- **PK:** ZoneID
- **Key Fields:** ZoneName

---

## Notes

1. **LoginName** represents the user/warehouse context for stock tracking
2. **Stock Quantities:** 
   - `AllWHStockQty` = All Warehouse Stock
   - `SubWHStockQty` = Sub Warehouse Stock
3. **Price Levels** are predefined in the system (Retail, Wholesale, etc.)
4. **Zones** are warehouse/region locations
5. All dates are in UTC format with timestamp
