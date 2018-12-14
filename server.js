const express = require('express');
const app = express();
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const PORT = process.env.PORT || 3000;
const { DATABASE_URL } = require("./config");
const userRouter = require('./routes/user-router');

const mongoose = require('mongoose');

app.use('/api', userRouter);

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    console.log("run server running");
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve(server);
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          }
        );
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);;
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
