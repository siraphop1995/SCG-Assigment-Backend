const router = require('express').Router();
const helper = require('../helpers/helperFunction');

//read all
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/findXYZ', (req, res) => {
  const items = ['x', '5', '9', '15', '23', 'y', 'z'];
  res.send(helper.findXYZ(items));
});

app.post('/findXYZ', (req, res, next) => {
  const { items } = req.body;
  if (!items) return next(new Error('ERROR: Please send JSON object with request'));

  res.send(helper.findXYZ(items));
});

app.get('/findPlace', (req, res) => {
  res.send('WIP');
});

module.exports = router;
