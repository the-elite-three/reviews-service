const express = require('express');
const db = require('../db/queries');

const router = express.Router();

router.get('/:productid/list', db.getReviews);

module.exports = router;
