const defaultReviewList = {
  product: 0,
  page: 0,
  count: 0,
  results: [{}],
};

const defaultReview = {
  review_id: 0,
  rating: 0,
  summary: '',
  recommend: 0,
  response: '',
  body: '',
  date: '',
  reviewer_name: '',
  helpfulness: 0,
  photos: [{}],
};

const defaultPhoto = {
  id: 0,
  url: '',
};


const defaultReviewMeta = {
  product_id: 0,
  ratings: {},
  recommended: {},
  characteristics: {},
};

const defaultCharacteristic = {
  id: 0,
  value: 0,
};

const formatReview = (productid, rows) => {
  const formatted = { productid, results: [] };
  const reviewIds = [];

  rows.forEach((row) => {
    if (!reviewIds.includes(row.review_id)) {
      reviewIds.push(row.review_id);
      formatted.results.push({
        review_id: row.review_id,
        rating: row.rating,
        summary: row.summary,
        recommend: row.recommend,
        response: row.response,
        body: row.body,
        date: row.date,
        reviewer_name: row.reviewer_name,
        helpfulness: row.helpfulness,
        photos: [],
      });
    }

    if (row.photo_url !== null) {
      formatted.results.forEach((result) => {
        if (result.review_id === row.review_id) {
          result.photos.push({
            id: row.photo_id,
            url: row.photo_url,
          });
        }
      });
    }
  });

  return formatted;
};

module.exports = {
  formatReview,
};
