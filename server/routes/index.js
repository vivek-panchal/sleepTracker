const express = require('express');
const user = require('./user');
const sleep = require('./sleep');

const router = express.Router();

router.use('/user', user);

router.use('/sleep', sleep);

module.exports = router;