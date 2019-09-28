const router = require('express').Router();
const axios = require('axios');
const helper = require('../helpers/helperFunction');
// const respond = require('../helpers/tempPlace');

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
  const key = 'AIzaSyCoVGJYwRwjsmawIQtF5gl1jO_sFUjpy0E';
  const query = 'restaurant';
  const location = '13.818981%2C100.527861';
  const radius = '5000';
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&key=${key}`;

  const respond = await axios.get(url);
  if (respond.data.status !== "OK") {
    return res.status(403).send(respond.data)
  }
  //Map result so that server only send needed data
  newResult = respond.data.results.map((result) => {
    //Extract map location from html_attribute
    const map_location = extractMap(result.photos[0].html_attributions[0], result.name)
    return {
      id: result.id,
      name: result.name,
      formatted_address: result.formatted_address,
      rating: result.rating,
      photoRef: result.photos[0].photo_reference,
      icon: result.icon,
      map_location: map_location,
      location: result.geometry.location
    }
  })

  //Attach status and next_page_token
  let newPlace = {
    next_page_token: respond.data.next_page_token,
    results: newResult,
    status: respond.data.status
  }

  res.send(newPlace);

});

app.get('/nextPlace/:token', async (req, res) => {
  const key = 'AIzaSyCoVGJYwRwjsmawIQtF5gl1jO_sFUjpy0E';
  const { token } = req.params
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${token}&key=${key}`;

  const respond = await axios.get(url);

  if (respond.data.status !== "OK") {
    return res.status(403).send(respond.data)
  }

  //Map result so that server only send needed data
  newResult = respond.data.results.map((result) => {
    //Extract map location from html_attribute
    const map_location = extractMap(result.photos[0].html_attributions[0], result.name)
    return {
      id: result.id,
      name: result.name,
      formatted_address: result.formatted_address,
      rating: result.rating,
      photoRef: result.photos[0].photo_reference,
      icon: result.icon,
      map_location: map_location,
      location: result.geometry.location
    }
  })

  //Attach status and next_page_token
  let newPlace = {
    next_page_token: respond.data.next_page_token,
    results: newResult,
    status: respond.data.status
  }

  res.send(newPlace);

});

const extractMap = (html) => {
  let baseHTML = html.split('"')
  return baseHTML[1]
};

module.exports = router;
