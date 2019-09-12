const fs = require('fs');
const faker = require('faker');

const tempConfig = {
  headers: ['id', 'review_id', 'url'],
  getFakeData: () => faker.fake('{{random.number}},{{image.imageUrl}}'),
};

const generateFile = (config) => {
  const { headers, getFakeData } = config;
  const writeStream = fs.createWriteStream('test.csv');
  writeStream.write(`${headers.join()}\n`);
  let counter = 0;
  for (let i = 0; i < 100000; i += 1) {
    let fileBuffer = '';
    for (let j = 0; j < 100; j += 1) {
      counter += 1;
      fileBuffer += `${counter},${getFakeData()}\n`;
    }
    writeStream.write(fileBuffer);
  }
  writeStream.on('finish', () => {
    console.log('done');
  });
  writeStream.end();
};

generateFile(tempConfig);
