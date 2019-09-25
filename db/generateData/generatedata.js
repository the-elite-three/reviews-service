const fs = require('fs');
const faker = require('faker');

// Constants
const MIN_RECS = 1;
const MAX_RECS = 10000000;
const MAX_WRITES = 10;
const MAX_LINES_PER_WRITE = 100000;
const FILE_COUNT = 10;
const MIN_RATING = 0;
const MAX_RATING = 5;
const MIN_COUNT = 0;
const MAX_COUNT = 25;

// Get random numbers
const getRandomIntInclusive = (min = 1, max = 5) => {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
};
const getRandomMaxRecInt = () => getRandomIntInclusive(MIN_RECS, MAX_RECS);
const getRandomRating = () => getRandomIntInclusive(MIN_RATING, MAX_RATING);
const getRandomCount = () => getRandomIntInclusive(MIN_COUNT, MAX_COUNT);

// Format Date
const getFormattedDate = (srcDate) => new Date(srcDate).toISOString().slice(0, 10).split('T')[0];

// Get random faker data
const getRandomDate = () => getFormattedDate(faker.date.between('2010-01-01', '2019-12-31'));
const getRandomDescriptor = () => faker.fake('{{commerce.productAdjective}}');
const getRandomSentence = () => faker.fake('{{lorem.sentence}}');
const getRandomParagraph = () => faker.fake('{{lorem.paragraph}}');
const getRandomBool = () => faker.fake('{{random.boolean}}');
const getRandomImgURL = () => faker.fake('{{image.imageUrl}}');
const getRandomUserName = () => faker.fake('{{internet.userName}}');
const getRandomEmail = () => faker.fake('{{internet.email}}');
const getRandomResponse = () => faker.fake('{{company.catchPhrase}}');

// File Config
const fileConfig = {
  reviews_photos: {
    headers: ['id', 'review_id', 'url'],
    fileName: 'reviews_photos',
    getFakeData: (id) => `${id},${getRandomMaxRecInt()},${getRandomImgURL()}`,
  },
  characteristics: {
    headers: ['id', 'product_id', 'name'],
    fileName: 'characteristics',
    getFakeData: (id) => `${id},${getRandomMaxRecInt()},${getRandomDescriptor()}`,
  },
  characteristic_reviews: {
    headers: ['id', 'characteristic_id', 'review_id', 'value'],
    fileName: 'characteristic_reviews',
    getFakeData: (id) => `${id},${getRandomMaxRecInt()},${getRandomMaxRecInt()},${getRandomRating()}`,
  },
  reviews: {
    headers: ['id', 'product_id', 'rating', 'date', 'summary', 'body', 'recommend', 'reported', 'reviewer_name', 'reviewer_email', 'response', 'helpfulness'],
    fileName: 'reviews',
    getFakeData: (id) => `${id},${getRandomMaxRecInt()},${getRandomRating()},${getRandomDate()},${getRandomSentence()},${getRandomParagraph()},${getRandomBool()},${getRandomBool()},${getRandomUserName()},${getRandomEmail()},${getRandomResponse()},${getRandomCount()}`,
  },
};

// File Generation
const generateFile = (config) => {
  const { headers, getFakeData, fileName } = config;
  const fileType = 'csv';
  let counter = 0;
  for (let fileNumber = 1; fileNumber <= FILE_COUNT; fileNumber += 1) {
    const writeStream = fs.createWriteStream(`${fileName}${fileNumber}.${fileType}`);
    writeStream.write(`${headers.join()}\n`);
    let fileBuffer = '';
    for (let i = 0; i < MAX_WRITES; i += 1) {
      for (let j = 0; j < MAX_LINES_PER_WRITE; j += 1) {
        counter += 1;
        fileBuffer += `${getFakeData(counter)}\n`;
      }
      writeStream.write(fileBuffer);
      fileBuffer = '';
    }
    writeStream.on('finish', () => {
      console.log(`wrote ${fileName}`);
    });
    writeStream.end();
  }
  return true;
};

// Generate files based on config
const generateRevPhotos = () => generateFile(fileConfig.reviews_photos);
const generateCharacteristics = () => generateFile(fileConfig.characteristics);
const generateCharReviews = () => generateFile(fileConfig.characteristic_reviews);
const generateReviews = () => generateFile(fileConfig.reviews);

module.exports = {
  generateRevPhotos,
  generateCharacteristics,
  generateCharReviews,
  generateReviews,
};
