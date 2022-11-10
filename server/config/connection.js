const mongoose = require("mongoose");

// Uses enviromental variables that I've set in my heroku app to connect to the db
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/toyzoid_db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection;
