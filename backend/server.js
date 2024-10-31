require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);
const cors = require("cors");

const yahooAuth = require("./router/yahooAuth");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.xml());
app.use("/api/yahooAuth", yahooAuth);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Hello.  Listening on port ${PORT}`);
});
