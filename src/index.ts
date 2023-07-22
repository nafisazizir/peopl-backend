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

require("./routes/users")(app);
require("./routes/communities")(app);
require("./routes/posts")(app);
require("./routes/comments")(app);
require("./routes/matchmaking")(app);
require("./routes/requests")(app);
require("./routes/messages")(app);
require("./routes/search")(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
