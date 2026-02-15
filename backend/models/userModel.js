import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    profileImage:{type:String,default:null},
    cartData:{type:Object,default:{}}
},{minimize:false})

const userModal = mongoose.models.user || mongoose.model("user", userSchema);

export default userModal;