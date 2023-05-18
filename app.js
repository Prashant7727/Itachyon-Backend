const express=require('express');
const mongoose=require('mongoose')
const app=express();
const cors=require("cors")
app.use(express.json());
const User=require('./models/user')
require('./connection')
const router=require('./routes/user')
app.use(cors());
PORT=process.env.PORT||8000;

app.use('/',router);



app.listen(PORT,()=>{
    console.log(`server started ap PORT : ${PORT}`)
})