const express = require('express');
const cors = require('cors');
const databaseConnection = require('./config/database');

const router = require('./routes/index');
const PORT = process.env.PORT || 4000;
const app = express();

databaseConnection();

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(PORT);

module.exports = app;