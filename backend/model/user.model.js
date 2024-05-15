const mongoose = require("mongoose")
const Schema = mongoose.Schema


const UserModel = new Schema({
    username: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true,
        min: 8,
        max:30
    },
    gender: {
        type: String,
        // required: true,
        enum:['male', 'female','others']
    },
    address: {
        tempAddress:[String],
        permanentAddress: {
            type: String,
            // required: true
        }
    },
    image:[String],
    role:{
        type: String, //1-normal user, 2-admin user, 3-super admin
        enum: ["super-admin","admin", "user"],
        default: "user"
    }, 
    isActivated: {
        type: Boolean,
        default: true
    }

}, { timestamps:true })

const User = mongoose.model("User", UserModel)
module.exports = User