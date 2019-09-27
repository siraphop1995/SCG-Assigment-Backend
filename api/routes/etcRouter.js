const router = require('express').Router();
const axios = require('axios');
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

app.get('/findPlace', async (req, res) => {
//   const key = 'AIzaSyCoVGJYwRwjsmawIQtF5gl1jO_sFUjpy0E';
//   const input = 'Museum%20of%20Contemporary%20Art%20Australia';
//   const fields = 'photos,formatted_address,name,rating,opening_hours,geometry';
//   const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=textquery&fields=${fields}&key=${key}`;
  
  const respond = await axios.get(url);
  res.send(respond.data);
});

module.exports = router;
