const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

app = express();
port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
// mongoose.connect(
//   'mongodb+srv://siraphop95:sira123456@cluster0-yejh3.gcp.mongodb.net/scgAssigment?retryWrites=true&w=majority',
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function(error) {
//     if (error) throw error;
//     console.log('Successfully connected to mongodb');
//   }
// );

//Express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Mongoose model
User = require('./api/models/userListModel');

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
