const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

async function executeQuery(query, params = {}) {
  const pool = await getPool();
  const request = pool.request();
  Object.entries(params).forEach(([key, value]) => {
    request.input(key, value);
  });
  return request.query(query);
}

// ============== CLIENTS MANAGEMENT ==============

router.get('/clients', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT TOP 1000
        ClientID, ClientCode, ClientName, AltClientName, Address, Phone, Email,
        Contact, City, State, ZoneID, PriceLevelID, Balance, CreditLimit,
        Active, LoginName, ModifiedDate
      FROM tbMobileClient
      ORDER BY ClientName
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/clients/:id', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT * FROM tbMobileClient WHERE ClientID = @ClientID
    `, { ClientID: req.params.id });
    res.json(result.recordset[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/clients', async (req, res) => {
  try {
    const { ClientID, ClientCode, ClientName, AltClientName, Address, Phone, Email, Contact, City, State, ZoneID, PriceLevelID, CreditLimit, Active, LoginName } = req.body;

    if (!ClientName || !LoginName) {
      return res.status(400).json({ error: 'ClientName and LoginName are required.' });
    }

    const query = `
      IF EXISTS (SELECT 1 FROM tbMobileClient WHERE ClientID = @ClientID AND LoginName = @LoginName)
        UPDATE tbMobileClient
        SET ClientCode = @ClientCode, ClientName = @ClientName, AltClientName = @AltClientName,
            Address = @Address, Phone = @Phone, Email = @Email, Contact = @Contact,
            City = @City, State = @State, ZoneID = @ZoneID, PriceLevelID = @PriceLevelID,
            CreditLimit = @CreditLimit, Active = @Active, ModifiedDate = GETDATE()
        WHERE ClientID = @ClientID AND LoginName = @LoginName
      ELSE
        INSERT INTO tbMobileClient (ClientID, ClientCode, ClientName, AltClientName, Address, Phone, Email, Contact, City, State, ZoneID, PriceLevelID, CreditLimit, Active, LoginName, ModifiedDate)
        VALUES (@ClientID, @ClientCode, @ClientName, @AltClientName, @Address, @Phone, @Email, @Contact, @City, @State, @ZoneID, @PriceLevelID, @CreditLimit, @Active, @LoginName, GETDATE())
    `;

    await executeQuery(query, {
      ClientID: ClientID || Math.floor(Math.random() * 1000000),
      ClientCode,
      ClientName,
      AltClientName,
      Address,
      Phone,
      Email,
      Contact,
      City,
      State,
      ZoneID,
      PriceLevelID,
      CreditLimit: CreditLimit || 0,
      Active: Active !== undefined ? Active : 1,
      LoginName
    });

    res.json({ success: true, message: ClientID ? 'Client updated' : 'Client created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/clients/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM tbMobileClient WHERE ClientID = @ClientID', { ClientID: req.params.id });
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== ITEMS MANAGEMENT ==============

router.get('/items', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT TOP 1000
        i.ItemID, i.ItemCode, i.ItemName, i.AltItemName, i.CategoryID, i.StockQty,
        i.Active, i.ModifiedDate, c.CategoryName
      FROM tbMobileItem i
      LEFT JOIN tbMobileItemCategory c ON i.CategoryID = c.CategoryID
      ORDER BY i.ItemName
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/items/:id', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT i.*, c.CategoryName
      FROM tbMobileItem i
      LEFT JOIN tbMobileItemCategory c ON i.CategoryID = c.CategoryID
      WHERE i.ItemID = @ItemID
    `, { ItemID: req.params.id });
    res.json(result.recordset[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/items', async (req, res) => {
  try {
    const { ItemID, ItemCode, ItemName, AltItemName, CategoryID, StockQty, Active } = req.body;

    if (!ItemName || !ItemCode) {
      return res.status(400).json({ error: 'ItemName and ItemCode are required.' });
    }

    const query = `
      IF EXISTS (SELECT 1 FROM tbMobileItem WHERE ItemID = @ItemID)
        UPDATE tbMobileItem
        SET ItemCode = @ItemCode, ItemName = @ItemName, AltItemName = @AltItemName,
            CategoryID = @CategoryID, StockQty = @StockQty, Active = @Active, ModifiedDate = GETDATE()
        WHERE ItemID = @ItemID
      ELSE
        INSERT INTO tbMobileItem (ItemID, ItemCode, ItemName, AltItemName, CategoryID, StockQty, Active, ModifiedDate, DefUnitID, SubCategoryID, ItemImgUrl, MatExp)
        VALUES (@ItemID, @ItemCode, @ItemName, @AltItemName, @CategoryID, @StockQty, @Active, GETDATE(), 1, @CategoryID, '', 0)
    `;

    await executeQuery(query, {
      ItemID: ItemID || Math.floor(Math.random() * 1000000),
      ItemCode,
      ItemName,
      AltItemName,
      CategoryID,
      StockQty: StockQty || 0,
      Active: Active !== undefined ? Active : 1
    });

    res.json({ success: true, message: ItemID ? 'Item updated' : 'Item created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM tbMobileItem WHERE ItemID = @ItemID', { ItemID: req.params.id });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== PRICE LEVELS MANAGEMENT ==============

router.get('/price-levels', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT PriceLevelID, PriceLevel, AltPriceLevel, ModifiedDate, CurrencyID, TTC
      FROM tbMobilePriceLevel
      ORDER BY PriceLevel
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/price-levels/:id', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT * FROM tbMobilePriceLevel WHERE PriceLevelID = @PriceLevelID
    `, { PriceLevelID: req.params.id });
    res.json(result.recordset[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/price-levels', async (req, res) => {
  try {
    const { PriceLevelID, PriceLevel, AltPriceLevel, CurrencyID, TTC } = req.body;

    if (!PriceLevel) {
      return res.status(400).json({ error: 'PriceLevel is required.' });
    }

    const query = `
      IF EXISTS (SELECT 1 FROM tbMobilePriceLevel WHERE PriceLevelID = @PriceLevelID)
        UPDATE tbMobilePriceLevel
        SET PriceLevel = @PriceLevel, AltPriceLevel = @AltPriceLevel, CurrencyID = @CurrencyID, TTC = @TTC, ModifiedDate = GETDATE()
        WHERE PriceLevelID = @PriceLevelID
      ELSE
        INSERT INTO tbMobilePriceLevel (PriceLevelID, PriceLevel, AltPriceLevel, CurrencyID, TTC, ModifiedDate)
        VALUES (@PriceLevelID, @PriceLevel, @AltPriceLevel, @CurrencyID, @TTC, GETDATE())
    `;

    await executeQuery(query, {
      PriceLevelID: PriceLevelID || Math.floor(Math.random() * 1000),
      PriceLevel,
      AltPriceLevel,
      CurrencyID: CurrencyID || 1,
      TTC: TTC !== undefined ? TTC : 0
    });

    res.json({ success: true, message: PriceLevelID ? 'Price level updated' : 'Price level created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== PRICE LEVEL ITEMS ==============

router.get('/price-levels/:id/items', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT TOP 1000
        ip.PriceLevelID, ip.ItemID, ip.UnitID, ip.Price, ip.Disc,
        i.ItemName, i.ItemCode, u.UnitCode
      FROM tbMobileItemPrice ip
      JOIN tbMobileItem i ON ip.ItemID = i.ItemID
      JOIN tbMobileUnit u ON ip.UnitID = u.UnitID
      WHERE ip.PriceLevelID = @PriceLevelID
      ORDER BY i.ItemName
    `, { PriceLevelID: req.params.id });
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/price-levels/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const { ItemID, UnitID, Price, Disc, LoginName } = req.body;

    if (!ItemID || !UnitID || !Price) {
      return res.status(400).json({ error: 'ItemID, UnitID, and Price are required.' });
    }

    const query = `
      IF EXISTS (SELECT 1 FROM tbMobileItemPrice WHERE PriceLevelID = @PriceLevelID AND ItemID = @ItemID AND UnitID = @UnitID)
        UPDATE tbMobileItemPrice SET Price = @Price, Disc = @Disc, ModifiedDate = GETDATE()
        WHERE PriceLevelID = @PriceLevelID AND ItemID = @ItemID AND UnitID = @UnitID
      ELSE
        INSERT INTO tbMobileItemPrice (PriceLevelID, ItemID, UnitID, Price, Disc, LoginName, ModifiedDate)
        VALUES (@PriceLevelID, @ItemID, @UnitID, @Price, @Disc, @LoginName, GETDATE())
    `;

    await executeQuery(query, {
      PriceLevelID: id,
      ItemID,
      UnitID,
      Price,
      Disc: Disc || 0,
      LoginName: LoginName || 'admin'
    });

    res.json({ success: true, message: 'Price level item added/updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/price-levels/:levelId/items/:itemId/:unitId', async (req, res) => {
  try {
    const { levelId, itemId, unitId } = req.params;
    await executeQuery(`
      DELETE FROM tbMobileItemPrice
      WHERE PriceLevelID = @PriceLevelID AND ItemID = @ItemID AND UnitID = @UnitID
    `, { PriceLevelID: levelId, ItemID: itemId, UnitID: unitId });
    res.json({ success: true, message: 'Price level item removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== WAREHOUSE ZONES ==============

router.get('/zones', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT ZoneID, ZoneName, AltZoneName, ModifiedDate
      FROM tbMobileZone
      ORDER BY ZoneName
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/zones', async (req, res) => {
  try {
    const { ZoneID, ZoneName, AltZoneName } = req.body;

    if (!ZoneName) {
      return res.status(400).json({ error: 'ZoneName is required.' });
    }

    const query = `
      IF EXISTS (SELECT 1 FROM tbMobileZone WHERE ZoneID = @ZoneID)
        UPDATE tbMobileZone
        SET ZoneName = @ZoneName, AltZoneName = @AltZoneName, ModifiedDate = GETDATE()
        WHERE ZoneID = @ZoneID
      ELSE
        INSERT INTO tbMobileZone (ZoneID, ZoneName, AltZoneName, ModifiedDate)
        VALUES (@ZoneID, @ZoneName, @AltZoneName, GETDATE())
    `;

    await executeQuery(query, {
      ZoneID: ZoneID || Math.floor(Math.random() * 1000),
      ZoneName,
      AltZoneName
    });

    res.json({ success: true, message: ZoneID ? 'Zone updated' : 'Zone created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== STOCK BY ITEM UNIT ==============

router.get('/stock', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT TOP 1000
        iu.ItemID, iu.UnitID, iu.AllWHStockQty, iu.SubWHStockQty, iu.SoldQty,
        iu.LoginName, iu.ModifiedDate, i.ItemName, i.ItemCode, u.UnitCode
      FROM tbMobileItemUnit iu
      JOIN tbMobileItem i ON iu.ItemID = i.ItemID
      JOIN tbMobileUnit u ON iu.UnitID = u.UnitID
      ORDER BY i.ItemName, u.UnitCode
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stock/item/:itemId', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT
        iu.ItemID, iu.UnitID, iu.AllWHStockQty, iu.SubWHStockQty, iu.SoldQty,
        iu.LoginName, iu.ModifiedDate, i.ItemName, i.ItemCode, u.UnitCode
      FROM tbMobileItemUnit iu
      JOIN tbMobileItem i ON iu.ItemID = i.ItemID
      JOIN tbMobileUnit u ON iu.UnitID = u.UnitID
      WHERE iu.ItemID = @ItemID
    `, { ItemID: req.params.itemId });
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stock', async (req, res) => {
  try {
    const { ItemID, UnitID, AllWHStockQty, SubWHStockQty, SoldQty, LoginName } = req.body;

    if (!ItemID || !UnitID || !LoginName) {
      return res.status(400).json({ error: 'ItemID, UnitID, and LoginName are required.' });
    }

    const query = `
      IF EXISTS (SELECT 1 FROM tbMobileItemUnit WHERE ItemID = @ItemID AND UnitID = @UnitID AND LoginName = @LoginName)
        UPDATE tbMobileItemUnit
        SET AllWHStockQty = @AllWHStockQty, SubWHStockQty = @SubWHStockQty, SoldQty = @SoldQty, ModifiedDate = GETDATE()
        WHERE ItemID = @ItemID AND UnitID = @UnitID AND LoginName = @LoginName
      ELSE
        INSERT INTO tbMobileItemUnit (ItemID, UnitID, AllWHStockQty, SubWHStockQty, SoldQty, LoginName, ModifiedDate)
        VALUES (@ItemID, @UnitID, @AllWHStockQty, @SubWHStockQty, @SoldQty, @LoginName, GETDATE())
    `;

    await executeQuery(query, {
      ItemID,
      UnitID,
      AllWHStockQty: AllWHStockQty || 0,
      SubWHStockQty: SubWHStockQty || 0,
      SoldQty: SoldQty || 0,
      LoginName
    });

    res.json({ success: true, message: 'Stock updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/stock/:itemId/:unitId/:loginName/adjust', async (req, res) => {
  try {
    const { itemId, unitId, loginName } = req.params;
    const { AdjustmentQty, Type } = req.body; // Type: 'all' or 'sub'

    if (AdjustmentQty === undefined) {
      return res.status(400).json({ error: 'AdjustmentQty is required.' });
    }

    const query = Type === 'sub'
      ? `UPDATE tbMobileItemUnit SET SubWHStockQty = SubWHStockQty + @AdjustmentQty, ModifiedDate = GETDATE()
         WHERE ItemID = @ItemID AND UnitID = @UnitID AND LoginName = @LoginName`
      : `UPDATE tbMobileItemUnit SET AllWHStockQty = AllWHStockQty + @AdjustmentQty, ModifiedDate = GETDATE()
         WHERE ItemID = @ItemID AND UnitID = @UnitID AND LoginName = @LoginName`;

    await executeQuery(query, {
      ItemID: itemId,
      UnitID: unitId,
      LoginName: loginName,
      AdjustmentQty
    });

    res.json({ success: true, message: 'Stock adjusted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
