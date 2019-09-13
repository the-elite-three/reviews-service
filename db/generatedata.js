const fs = require('fs');
const faker = require('faker');

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const tempConfig = {
  reviews_photos: {
    headers: ['id', 'review_id', 'url'],
    fileName: 'reviews_photos.csv',
    getFakeData: (id) => `${id},${faker.fake('{{random.number}},{{image.imageUrl}}')}`,
  },
  characteristics: {
    headers: ['id', 'product_id', 'name'],
    fileName: 'characteristics.csv',
    getFakeData: (id) => `${id},${faker.fake('{{random.number}},{{commerce.productAdjective}}')}`,
  },
  characteristic_reviews: {
    headers: ['id', 'characteristic_id', 'review_id', 'value'],
    fileName: 'characteristic_reviews.csv',
    getFakeData: (id) => `${id},${getRandomInt(10000000)},${getRandomInt(10000000)},${getRandomInt(5)}`,
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
