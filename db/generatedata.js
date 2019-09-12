const fs = require('fs');

const tempHeaders = ['id', 'review_id', 'url'];

const generateFile = (headers) => {
  const writeStream = fs.createWriteStream('test.csv');
  writeStream.write(`${headers.join()}\n`);
  const tempData = [];
  for (let i = 0; i < 10; i += 1) {
    tempData.push(i);
  }
  writeStream.write(tempData.join());
  writeStream.on('finish', () => {
    console.log('done');
  });
  writeStream.end();
};

generateFile(tempHeaders);
