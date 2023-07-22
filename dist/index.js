"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const bodyParser = require("body-parser");
const cors = require("cors");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(cors());
mongoose_1.default
    .connect(process.env.DB_URL)
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
//# sourceMappingURL=index.js.map