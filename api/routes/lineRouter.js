const router = require('express').Router();

//read all
app.get('/webhook', (req, res) => {
  res.send('Hello World!');
});

module.exports = router;
