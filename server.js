require('dotenv').config(); 
const express = require('express'); 
const mongoose = require('mongoose'); 
const connectDb = require("./Config/DbConnection"); 
const errorHandler = require("./Middleware/errorHandler"); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
const bcrypt = require('bcryptjs');

mongoose.set('strictQuery', false); 


connectDb();

const app = express(); 
const port = process.env.PORT || 5000; 


app.use(cors()); 
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.use('/api/users', require('./Routers/UserRouters')); 


app.use(errorHandler); 


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
