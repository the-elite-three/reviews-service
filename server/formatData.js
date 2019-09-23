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

const defaultCharacteristic = {
  id: 0,
  value: 0,
};

const formatReview = (productid, rows) => {
  const reviewIds = []; // Track ids already in the object
  const results = [];

  rows.forEach((row) => {
    if (!reviewIds.includes(row.review_id)) {
      reviewIds.push(row.review_id);
      results.push({
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
      results.forEach((result) => {
        if (result.review_id === row.review_id) {
          result.photos.push({
            id: row.photo_id,
            url: row.photo_url,
          });
        }
      });
    }
  });

  return (
    {
      productid,
      page: 0,
      count: results.length,
      results,
    }
  );
};

const formatReviewMeta = (productid, rows) => {
  const reviewIds = []; // Track ids already in the return object
  const defaultReviewMeta = {
    product_id: productid,
    ratings: {},
    recommended: { 0: 0, 1: 0 },
    characteristics: {},
  };
  console.log(rows);
  const metaReducer = (acc, currentVal) => {
    if (!reviewIds.includes(currentVal.review_id)) { // if review_id not already in array
      reviewIds.push(currentVal.review_id); // push id
      // Update rating count
      if (Object.prototype.hasOwnProperty.call(acc.ratings, [currentVal.rating])) {
        acc.ratings[currentVal.rating] += 1; // increment exisitng count
      } else {
        acc.ratings[currentVal.rating] = 1; // set count
      }
      // Update recommended count
      if (currentVal.recommend === true) {
        acc.recommended[0] += 1; // increment 'yes' recommended
      } else {
        acc.recommended[1] += 1; // incremement 'no' recommended
      }
    }
    return acc;
  };
  return rows.reduce(metaReducer, defaultReviewMeta);
};

module.exports = {
  formatReview,
  formatReviewMeta,
};
