const router = require('express').Router();

//read all
app.post('/webhook', (req, res) => {
  res.send('Hello World!');
});

module.exports = router;
