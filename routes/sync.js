const express = require('express');
const router = express.Router();
const { getPool, upsertRecords } = require('../db');

const idempotentTableKeys = {
  tbMobileClient: ['ClientID', 'LoginName'],
  tbMobileItem: ['ItemID'],
  tbMobileItemCategory: ['CategoryID'],
  tbMobileTrans: ['MobileTransID'],
  tbMobileVisit: ['MobileVisitID'],
  tbMobileReceipt: ['MobileReceiptID'],
};

function stripSyncMetadata(record) {
  const cleaned = { ...record };
  delete cleaned.sync_state;
  delete cleaned.last_synced_at;
  return cleaned;
}

function normalizeRecords(records) {
  if (!Array.isArray(records)) {
    return [];
  }
  return records.map(stripSyncMetadata);
}

router.get('/status', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 AS alive');
    res.json({ status: 'ok', alive: result.recordset[0].alive });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/clients', async (req, res) => {
  try {
    const pool = await getPool();
    const query = pool.request();
    const loginName = req.query.loginName;

    if (loginName) {
      query.input('loginName', loginName);
    }

    const sqlQuery = loginName
      ? 'SELECT * FROM tbMobileClient WHERE LoginName = @loginName ORDER BY ClientName'
      : 'SELECT top 10 * FROM tbMobileClient ORDER BY ClientName';

    const result = await query.query(sqlQuery);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/items', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT top 10 * FROM tbMobileItem ORDER BY ItemName');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT top 10 * FROM tbMobileItemCategory ORDER BY CategoryName');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM tbMobileTrans ORDER BY MobileTransID');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/visits', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM tbMobileVisit ORDER BY MobileVisitID');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/receipts', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM tbMobileReceipt ORDER BY MobileReceiptID');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/clients', async (req, res) => {
  try {
    const records = normalizeRecords(req.body);
    const result = await upsertRecords('tbMobileClient', records, idempotentTableKeys.tbMobileClient);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/items', async (req, res) => {
  try {
    const records = normalizeRecords(req.body);
    const result = await upsertRecords('tbMobileItem', records, idempotentTableKeys.tbMobileItem);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const records = normalizeRecords(req.body);
    const result = await upsertRecords('tbMobileItemCategory', records, idempotentTableKeys.tbMobileItemCategory);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const records = normalizeRecords(req.body);
    const result = await upsertRecords('tbMobileTrans', records, idempotentTableKeys.tbMobileTrans);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/visits', async (req, res) => {
  try {
    const records = normalizeRecords(req.body);
    const result = await upsertRecords('tbMobileVisit', records, idempotentTableKeys.tbMobileVisit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/receipts', async (req, res) => {
  try {
    const records = normalizeRecords(req.body);
    const result = await upsertRecords('tbMobileReceipt', records, idempotentTableKeys.tbMobileReceipt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
function encrypt(clearString) {
    if (!clearString) return "";
    let encryptedString = "";
    const baseIncrement = 128;

    for (let i = 0; i < clearString.length; i++) {
        const charCode = clearString.charCodeAt(i);
        const encryptedCharCode = charCode + baseIncrement + i;
        encryptedString += String.fromCharCode(encryptedCharCode);
    }

    return encryptedString;
}
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const expectedDomain = '@aston.edm';

    if (!normalizedEmail.endsWith(expectedDomain)) {
      return res.status(400).json({ error: `Email must use the ${expectedDomain} domain.` });
    }

    const loginName = normalizedEmail.substring(0, normalizedEmail.length - expectedDomain.length);
    if (!loginName) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const pool = await getPool();
    const query = pool.request();

    // Accept device serial from body (camel/snake/case variants) or from header `x-device-sn`.
    const deviceSN = (
      req.body?.deviceSN || req.body?.mobileDeviceSN || req.body?.MobileDeviceSN || req.headers['x-device-sn'] || ''
    ).toString();

    query.input('loginName', loginName);
    query.input('password', encrypt(password));
    query.input('MobileDeviceSN', deviceSN);

    const result = await query.execute('UserLogin');

    const user = Array.isArray(result.recordset) && result.recordset.length ? result.recordset[0] : null;
    if (!user || user.ID < 0) {
      return res.status(401).json({ error: 'Invalid login credentials.' });
    }

    return res.json({
      success: true,
      user: {
        id: user.ID ?? null,
        loginName: user.LoginName,
        email: `${user.LoginName}${expectedDomain}`,
        fullName: user.FullName ?? user.Name ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
