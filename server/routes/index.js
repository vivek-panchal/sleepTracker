const express = require('express');
const user = require('./user');

const router = express.Router();

router.use('/user', user);
// router.use('/sleep', require('./sleep'));

module.exports = router;