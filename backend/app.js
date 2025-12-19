const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./db/config')
const User = require('./routers/user')
const Books = require('./routers/book')
const Favourite = require('./routers/favourite')
const Cart = require('./routers/cart')
const Order = require('./routers/order')
app.use(express.json())
app.use(cors({
    origin: [
      "https://book-store-fawn-one.vercel.app",
      "https://book-store-1t9h.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

//routes
app.use('/api/v1',User)
app.use('/api/v1',Books)
app.use('/api/v1',Favourite)
app.use('/api/v1',Cart)
app.use('/api/v1',Order)


//creating Port
const port = process.env.PORT || 1000;
app.listen(port,()=>{
    console.log(`sever started at port ${port}`);
})