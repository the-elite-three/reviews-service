const fs = require('fs');
const faker = require('faker');

const MAX_RECS = 10000000;
const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
const getRandomMaxRecInt = () => getRandomInt(MAX_RECS);
const getRandomDescriptor = () => faker.fake('{{commerce.productAdjective}}');
const getRandomDate = () => faker.date.between('2010-01-01', '2019-12-31');
const getRandomBool = () => faker.fake('{{random.boolean}}');
const getRandomImgURL = () => faker.fake('{{image.imageUrl}}');
const getRandomUserName = () => faker.fake('{{internet.userName}}');
const getRandomEmail = () => faker.fake('{{internet.email}}');
const getRandomResponse = () => faker.fake('{{company.catchPhrase}}');


// 1,1,5,"2019-01-01","This product was great!","I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.",true,false,"funtime","first.last@gmail.com",,8

const tempConfig = {
  reviews_photos: {
    headers: ['id', 'review_id', 'url'],
    fileName: 'reviews_photos.csv',
    getFakeData: (id) => `${id},${getRandomMaxRecInt()},${getRandomImgURL()}`,
  },
  characteristics: {
    headers: ['id', 'product_id', 'name'],
    fileName: 'characteristics.csv',
    getFakeData: (id) => `${id},${getRandomMaxRecInt()},${getRandomDescriptor()}`,
  },
  characteristic_reviews: {
    headers: ['id', 'characteristic_id', 'review_id', 'value'],
    fileName: 'characteristic_reviews.csv',
    getFakeData: (id) => `${id},${getRandomInt(10000000)},${getRandomInt(10000000)},${getRandomInt(5)}`,
  },
  reviews: {
    headers: ['id', 'product_id', 'rating', 'date', 'summary', 'body', 'recommend', 'reported', 'reviewer_name', 'reviewer_email', 'response', 'helpfulness'],
    fileName: 'reviews.csv',
    getFakeData: (id) => `${id},${getRandomInt(10000000)},${getRandomInt(5)},${getRandomDate()},${faker.fake('{{lorem.sentence}},{{lorem.paragraph}}')},${getRandomBool()},${getRandomBool()},${getRandomUserName()},${getRandomEmail()},${getRandomResponse()},${getRandomInt(25)}`,
  },
};

const generateFile = (config) => {
  const { headers, getFakeData, fileName } = config;
  const writeStream = fs.createWriteStream(fileName);
  writeStream.write(`${headers.join()}\n`);
  let counter = 0;
  for (let i = 0; i < 100; i += 1) {
    let fileBuffer = '';
    for (let j = 0; j < 10; j += 1) {
      counter += 1;
      fileBuffer += `${getFakeData(counter)}\n`;
    }
    writeStream.write(fileBuffer);
  }
  writeStream.on('finish', () => {
    console.log('done');
  });
  writeStream.end();
};

generateFile(tempConfig.reviews_photos);
generateFile(tempConfig.characteristics);
generateFile(tempConfig.characteristic_reviews);
generateFile(tempConfig.reviews);
