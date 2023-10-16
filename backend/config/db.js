const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const envfile = path.resolve(__dirname, "../../.env");
dotenv.config({
  path: envfile,
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: true,
    });
    console.log(`MongoDb connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};
module.exports = connectDB;
