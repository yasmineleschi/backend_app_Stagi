
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDb = require("./Config/DbConnection");

dotenv.config();

mongoose.set('strictQuery', false);

connectDb();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});