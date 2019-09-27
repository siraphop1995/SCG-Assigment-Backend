const router = require('express').Router();
const helper = require('../helpers/helperFunction');

//read all
app.get('/', (req, res) =>  {
  res.send('Hello World!');
});

app.get('/getXYZ', (req, res) => {
  res.send(helper.findXYZ());
});

module.exports = router;
