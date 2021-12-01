require("dotenv").config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require("cors")
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true };
const mongoose = require("mongoose")
const errorMiddleware = require("./middlewares/errorMiddleware")

const router = require('./routes/Router');

const dbURL = process.env.MONGO_URL || "mongodb://localhost:27017/RecipesDB"
const PORT = process.env.PORT || 5001


const app = express();



app.use(cors(corsOptions));
app.use(express.json({limit: 100000}));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/recipes', router);
app.use(errorMiddleware)


const start = async () => {
  try {
    await mongoose.connect(dbURL)
    app.listen(PORT, () => {console.log(`Server started on ${PORT} port`)})
  } catch (e) {
    console.log(e)
  }
}

start()