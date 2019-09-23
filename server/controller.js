// Helper reduce function for sum
const sumReducer = (acc, currentVal) => acc + currentVal;

// Format Review for GET request
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

// Format Review Meta for GET request
const formatReviewMeta = (productid, rows) => {
  const reviewIds = []; // Track ids already in the return object

  // Default object to return for Review Meta
  const defaultReviewMeta = {
    product_id: productid,
    ratings: {},
    recommended: { 0: 0, 1: 0 },
    characteristics: {},
  };

  // Reducer to transform rows into inital object to be returned to client
  const metaReducer = (acc, currentVal) => {
    if (!reviewIds.includes(currentVal.id)) { // if review_id not already in array
      reviewIds.push(currentVal.id); // push id
      // Update rating count
      if (Object.prototype.hasOwnProperty.call(acc.ratings, currentVal.rating)) {
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

    // Update Characteristics
    if (currentVal.char_name !== null) { // if there is a characteristc name associated with row
      if (!Object.prototype.hasOwnProperty.call(acc.characteristics, currentVal.char_name)) {
        acc.characteristics[currentVal.char_name] = {
          id: currentVal.characteristic_id,
          value: [currentVal.review_value],
        };
      } else {
        acc.characteristics[currentVal.char_name].value.push(currentVal.review_value);
      }
    }
    return acc;
  };

  // Invoke reducer on returned rows
  const meta = rows.reduce(metaReducer, defaultReviewMeta);

  // Get average of characteristics on reduced meta
  const characteristics = Object.keys(meta.characteristics);
  characteristics.forEach((charName) => {
    meta.characteristics[charName].value = meta.characteristics[charName].value
      .reduce(sumReducer, 0) / meta.characteristics[charName].value.length;
  });

  // return final form
  return meta;
};

module.exports = {
  formatReview,
  formatReviewMeta,
};
