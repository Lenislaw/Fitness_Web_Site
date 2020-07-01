const mongoose = require("mongoose");
const config = require("config");

// Get MongoDB from global variables
const db = config.get("mongoURI");

// Init connect with MandgoDB
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(error.message);
    // Exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
