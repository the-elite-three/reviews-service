require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); 
  res.header('Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (request, response) => {
  response.json({ info: 'Totally working' });
});

app.use('/reviews', require('./routes'));

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
