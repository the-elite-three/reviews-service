const { pool } = require('./pool');

// Get reviews from database
const getReviews = (req, res) => {
  const { productid } = req.params;
  pool.query(`SELECT * FROM review WHERE product_id = ${productid}`, (err, results) => {
    if (err) res.status(500).json(err);
    res.status(200).json(results.rows);
  });
};

// Get review meta data from database
const getReviewMeta = (req, res) => {
  const { productid } = req.params;
  pool.query(`SELECT * FROM review WHERE product_id = ${productid}`, (err, results) => {
    if (err) res.status(500).json(err);
    res.status(200).json(results.rows);
  });
};

// Add review to database
const addReview = (req, res) => {
  res.end();
};

// Update review helpful in database
const updateReviewHelpful = (req, res) => {
  res.end();
};

// Report review in database
const reportReview = (req, res) => {
  res.end();
};

module.exports = {
  getReviews,
  getReviewMeta,
  addReview,
  updateReviewHelpful,
  reportReview,
};
