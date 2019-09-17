const { pool } = require('./pool');
const { formatReview } = require('../server/formatData');

const query = {
  selectReviews: (productid) => (
    {
      text:
      `SELECT review.id as review_id, review.rating, review.rating_date as date, review.summary, review.body,
      review.recommend, review.reviewer_name, review.helpfulness, reviews_photos.id as photo_id, reviews_photos.photo_url
        FROM review, reviews_photos
        WHERE review.product_id = $1
        AND review.id = reviews_photos.review_id`,
      values: [productid],
    }
  ),
};

// Get reviews from database
const getReviews = (req, res) => {
  const { productid } = req.params;
  pool.query(query.selectReviews(productid))
    .then((results) => formatReview(productid, results.rows))
    .then((formated) => res.status(200).json(formated))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
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
