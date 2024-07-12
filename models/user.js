const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    // firstName: {type: String, required: true},
    // lastName: {type: String, required: true},
    userName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: false},
    // profilePicture: {type: String, required: false},
    role: {
        type: String,
        enum: ['magazineOwner', 'user','driver','superAdmin'], // Example roles
        default: 'user'
      },
      phoneNumber:{type:Number,required:false,default:70000000},
    id: {type: String}
})

module.exports = mongoose.model("User", userSchema)