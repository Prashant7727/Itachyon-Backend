
const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
   
   firstName:{
    type:String
   },
   lastName:{
    type:String
   },
   email:{
    type:String
   },
   password:{
    type:String
   },
   phone:{
    type:String
   },
   userRole:{
    type:String
   },
   
   clinicName:{
    type:String
   },
   clinicCode:{
    type:String
   },
   clinicBlock:{
    type:String
   }
})

const User=mongoose.model("userlogin",userSchema);
module.exports=User;