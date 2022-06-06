import mongoose from 'mongoose'

const user = new mongoose.Schema({
    username:{
        type: String,
        unique: true
    },
    password: String,
    role:String,
    isAdmin:{
        type: Boolean,
        default: false
    }
})

export default mongoose.model("User",user);