require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use(cors());

app.get('/', (request, response) => {
  response.json({ info: 'Totally working' });
});

app.use('/reviews', require('./routes'));

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
