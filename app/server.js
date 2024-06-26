const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
  const img = fs.readFileSync(path.join(__dirname, "images/tom.png"));
  res.writeHead(200, { 'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

// use when starting application locally with node command
const mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// use when starting application as a separate docker container
const mongoUrlDocker = "mongodb://admin:password@host.docker.internal:27017";

// use when starting application as docker container, part of docker-compose
const mongoUrlDockerCompose = "mongodb://admin:password@mongodb";

const databaseName = "my-db";

app.post('/update-profile', function (req, res) {
  const userObj = req.body;

  MongoClient.connect(mongoUrlLocal, function (err, client) {
    if (err) throw err;

    const db = client.db(databaseName);
    userObj['userid'] = 1;

    const myquery = { userid: 1 };
    const newvalues = { $set: userObj };

    db.collection("users").updateOne(myquery, newvalues, { upsert: true }, function (err, result) {
      if (err) throw err;
      client.close();
      res.send(userObj);
    });
  });
});

app.get('/get-profile', function (req, res) {
  let response = {};

  MongoClient.connect(mongoUrlLocal, function (err, client) {
    if (err) throw err;

    const db = client.db(databaseName);
    const myquery = { userid: 1 };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();
      res.send(response ? response : {});
    });
  });
});

app.listen(port, function () {
  console.log(`Server is running on http://localhost:${port}`);
});
