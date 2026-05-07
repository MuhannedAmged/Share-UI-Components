require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.static("src"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/check"));
app.use("/projects", require("./routes/project"));
app.use("/api/user", require("./routes/userRoutes"));
app.use(require("./routes/404"));

mongoose
  .connect(uri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`http://localhost:${port}`);
    });
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
