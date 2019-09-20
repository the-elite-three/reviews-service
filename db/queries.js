const { pool } = require('./pool');
const { formatReview, formatReviewMeta } = require('../server/formatData');

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
  selectReviewsMeta: (productid) => (
    {
      text: `SELECT review.rating, review.recommend
        FROM review
        WHERE review.product_id = $1`,
      values: [productid],
    }
  ),
  insertReview: (productid) => (
    {
      text: `INSERT INTO review (product_id, rating, summary, body, reviewer_name, reviewer_email)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
      values: [productid, 2, 'summary', 'body', 'mah_name', 'mah_fake_email@email.com'],
    }
  ),
  updateReviewHelpful: (reviewId) => (
    {
      text: `UPDATE review SET helpfulness = helpfulness+1
        WHERE review.id = $1
        RETURNING helpfulness`,
      values: [reviewId],
    }
  ),
  updateReviewReported: (reviewId) => (
    {
      text: `UPDATE review SET reported = true
        WHERE review.id = $1
        RETURNING reported`,
      values: [reviewId],
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
  pool.query(query.selectReviewsMeta(productid))
    .then((results) => formatReviewMeta(productid, results.rows))
    .then((formated) => res.status(200).json(formated))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

// Add review to database
const addReview = (req, res) => {
  const { productid } = req.params;
  pool.query(query.insertReview(productid))
    .then((results) => res.status(200).json(results.rows))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

// Update review helpful in database
const updateReviewHelpful = (req, res) => {
  const { reviewid } = req.params;
  pool.query(query.updateReviewHelpful(reviewid))
    .then((results) => res.status(200).json(results.rows))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

// Report review in database
const reportReview = (req, res) => {
  const { reviewid } = req.params;
  pool.query(query.updateReviewReported(reviewid))
    .then((results) => res.status(200).json(results.rows))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

module.exports = {
  getReviews,
  getReviewMeta,
  addReview,
  updateReviewHelpful,
  reportReview,
};
