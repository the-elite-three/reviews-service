const { pool } = require('./pool');
const { formatReview, formatReviewMeta } = require('../server/formatData');

// Build array params (ex: 3 elements returns $2, $3, $4)
const buildArrayParams = (arr, startVal = 2) => arr.map(((value, index) => `$${index + startVal}`)).join();
const buildValues = (id, nestedArr) => nestedArr.map((value) => [id].concat(...value));

// Build Queries
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
  insertReview: (productid, reviewData = [2, 'summary', 'body', 'mah_name', 'mah_fake_email@email.com']) => (
    {
      text: `INSERT INTO review (product_id, rating, summary, body, reviewer_name, reviewer_email)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
      values: [productid, ...reviewData],
    }
  ),
  insertPhotos: (reviewId, photoURLs) => {
    const arrayParams = buildArrayParams(photoURLs);
    return (
      {
        text: `INSERT INTO reviews_photos (review_id, photo_url)
          VALUES ($1, unnest(array[${arrayParams}]))
          RETURNING id`,
        values: [reviewId, ...photoURLs],
      }
    );
  },
  insertCharacteristicReview: (reviewId, characteristics) => {
    const flatCharacteristics = buildValues(reviewId, Object.entries(characteristics))
      .map((value) => `(${value.join()})`)
      .join();
    return (
      {
        text: `INSERT INTO characteristics_review (review_id, characteristic_id, review_value)
          VALUES ${flatCharacteristics}
          RETURNING id`,
        values: [],
      }
    );
  },
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
  const { photoURLs = ['test'] } = req.query;
  const { characteristics = { 14: 5, 16: 2 } } = req.query;
  let reviewId = 0; // initial value for review id

  pool.query(query.insertReview(productid))
    .then((results) => {
      reviewId = results.rows[0].id;
      if (photoURLs.length > 0) { // if there are any photos
        return pool.query(query.insertPhotos(reviewId, photoURLs));
      }
      return results;
    })
    .then((results) => {
      if (Object.keys(characteristics).length > 0 && reviewId > 0) { // if characteristics exist
        return pool.query(query.insertCharacteristicReview(reviewId, characteristics));
      }
      return results;
    })
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
