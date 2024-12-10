require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./Config/DbConnection");
const errorHandler = require("./Middleware/errorHandler");
const path = require("path");

connectDb();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploadsAttachment', express.static(path.join(__dirname, 'uploadsAttachment')));

app.use("/api/publications", require("./Routers/publicationRouter"));
app.use("/api/users", require("./Routers/UserRouters"));
app.use("/api/users/profile", require("./Routers/StudentRouters"));
app.use("/api/institutions", require("./Routers/InstitutionRouters"));
app.use("/api/companies", require("./Routers/CompanyRouters"));
app.use("/api/attachment", require("./Routers/attachmentRoutes"));
app.use("/api/internshipApply", require("./Routers/InternshipApplyRouters"));
app.use(errorHandler);


if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
