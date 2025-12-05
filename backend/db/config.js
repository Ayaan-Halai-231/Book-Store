require("dotenv").config()
const mongoose = require('mongoose');
// mongoose.connect(process.env.DB_URL_LOCAL)
mongoose.connect(process.env.DB_URL)