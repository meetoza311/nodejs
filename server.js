const express = require("express");
var bodyParser = require("body-parser");
const path = require("path");
const fileUpload = require("express-fileupload")
var cors = require("cors");
const dotenvParseVariables = require('dotenv-parse-variables');
const { sequelize } = require("./app/models/index");

let env = require('dotenv').config();
env = dotenvParseVariables(env.parsed);

const app = express();

app.use(fileUpload({
  // limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const db = require("./app/models/index");
const dir = path.join(__dirname, "uploads");
app.use("/public", express.static(dir));

db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Welcome user!" });
});

require("./app/routes/users.routes")(app);

var PORT = process.env.PORT || 8087;

app.listen(PORT, async(address) => {
  // console.log(process.env)
  // await db.sequelize.query(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`)
  console.log(`Server is running on port ${PORT}.`);
});
