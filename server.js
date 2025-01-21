const mongoose = require('mongoose');
const express = require('express');
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true })) 
const path = require('path');

const adminroute = require('./Routes/adminroute');
const absenceroute=require("./Routes/absencesroute")
const leaveroute=require('./Routes/leaveroute')
app.use('/admin', adminroute);
app.use('/absence', absenceroute);
app.use('/leaves',leaveroute);
app.use("/uploads", express.static("uploads"));
 
 
 

mongoose.connect('mongodb://localhost:27017/HRmanagement')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running'));
