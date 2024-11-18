require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./Config/DbConnection");
const errorHandler = require("./Middleware/errorHandler");

connectDb();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/publications", require("./Routers/publicationRouter"));
app.use("/api/users", require("./Routers/UserRouters"));
app.use("/api/users/profile", require("./Routers/StudentRouters"));
app.use("/api/institutions", require("./Routers/InstitutionRouters"));
app.use("/api/companies",  require("./Routers/CompanyRouters"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
