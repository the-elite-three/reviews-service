const { pool } = require('./pool');

const getReviews = (req, res) => {
  const { productid } = req.params;
  pool.query(`SELECT * FROM review WHERE product_id = ${productid}`, (err, results) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getReviews,
};
