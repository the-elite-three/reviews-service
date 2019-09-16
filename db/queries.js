const { pool } = require('./pool');

const getReviews = (req, res) => {
  const { productid } = req.params;
  pool.query(`SELECT * FROM review WHERE product_id = ${productid}`, (err, results) => {
    if (err) res.status(500).json(err);
    res.status(200).json(results.rows);
  });
};

const getReviewMeta = (req, res) => {
  const { productid } = req.params;
  pool.query(`SELECT * FROM review WHERE product_id = ${productid}`, (err, results) => {
    if (err) res.status(500).json(err);
    res.status(200).json(results.rows);
  });
};


module.exports = {
  getReviews,
  getReviewMeta,
};
