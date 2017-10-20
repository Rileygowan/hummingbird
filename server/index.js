"use strict";

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const MongoClient   = require("mongodb").MongoClient;
const url           = 'mongodb://localhost:27017/tweeter';
const sassMiddleware= require('node-sass-middleware')

// SASS preprocessor
app.use(sassMiddleware({
    src: './stylesheets',
    dest: './public/styles',
    prefix:  '/styles'
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Initialize connection to MongoDB
MongoClient.connect(url, (err, db)=>{
  if (err) {
    console.log(`Failed to connect: ${url}`);
    throw err;
  }
  console.log(`Succeeded to connect: ${url}`);

//data-helpers.js handed db
  const DataHelpers = require("./lib/data-helpers.js")(db);
//./routes/tweets handed Datahelpers
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
//tweetsRoutes handed /tweets prefix
  app.use("/tweets", tweetsRoutes);
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
