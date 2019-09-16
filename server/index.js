const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.get('/', (request, response) => {
  response.json({ info: 'Totally working' });
});

app.use('/reviews', require('./routes'));

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
