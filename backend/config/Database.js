const mongoose = require("mongoose");

module.exports = connectMongo = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(connect.connection.name);
  } catch (error) {
    console.error(error);
  }
};
