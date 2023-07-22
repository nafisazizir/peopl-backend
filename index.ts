import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";

const bodyParser = require("body-parser");
const cors = require("cors");

config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.DB_URL!)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.send("Welcome to Peopl Back End!");
});

require("./src/routes/users")(app);
require("./src/routes/communities")(app);
require("./src/routes/posts")(app);
require("./src/routes/comments")(app);
require("./src/routes/matchmaking")(app);
require("./src/routes/requests")(app);
require("./src/routes/messages")(app);
require("./src/routes/search")(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
