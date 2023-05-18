
const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
   
   photo: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    contactEmail: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    sex: {
      type: String,
      required: true
    },
    mobilePhone: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  });

const User=mongoose.model("userData",userSchema);
module.exports=User;