const fs = require('fs');

const writeStream = fs.createWriteStream('test.csv');

const headers = ['id', 'review_id', 'url'].join();
writeStream.write(`${headers}\n`);
const tempData = [];
for (let i = 0; i < 10; i += 1) {
  tempData.push(i);
}
writeStream.write(tempData.join());

writeStream.on('finish', () => {
  console.log('done');
});

writeStream.end();
