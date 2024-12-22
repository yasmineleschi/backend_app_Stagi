const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "Database connected:",
      connect.connection.host,
      connect.connection.name
    );
    console.log('MongoDB connecté avec succès');
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  }
};

module.exports = connectDb;