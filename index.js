const express = require('express');
const cors = require('cors');
const config = require('./config');
const syncRouter = require('./routes/sync');
const adminRouter = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api', syncRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.json({ message: 'ASAP backend sync service is running' });
});

app.listen(config.port, () => {
  console.log(`ASAP backend listening on port ${config.port}`);
});
