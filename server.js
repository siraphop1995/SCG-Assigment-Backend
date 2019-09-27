const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

app = express();
port = process.env.PORT || 3000;

//Use body-parser to parser request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Use router
const etcRouter = require('./api/routes/etcRouter');
const lineRouter = require('./api/routes/lineRouter');

app.use(etcRouter);
app.use(lineRouter);

//Use custom express error handler
app.use(errorHandler);

function errorHandler(err, req, res, next) {
  let newError = {
    message: err.message,
    location: err.location
  };
  res.status(500).send(newError);
}

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
