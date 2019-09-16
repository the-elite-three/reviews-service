/*
  Routes for reviews endpoint

  GET /reviews/:product_id/list
  GET /reviews/:product_id/meta
  POST /reviews/:product_id
  PUT /reviews/helpful/:review_id
  PUT /reviews/report/:review_id
*/

const express = require('express');
const db = require('../db/queries');

const router = express.Router();

// Get routes
router.get('/:productid/list', db.getReviews);
router.get('/:productid/meta', db.getReviewMeta);

// Post routes
router.post('/:productid', db.addReview);

// Put routes
router.put('/helpful/:review_id', db.updateReviewHelpful);
router.put('/report/:review_id', db.reportReview);

module.exports = router;
