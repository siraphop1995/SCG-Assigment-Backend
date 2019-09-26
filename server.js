const express = require("express");
const app = express();
const helper = require("./Helpers/helperFunction");

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/getXYZ", (req, res) => {
  res.send(helper.findXYZ())
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
