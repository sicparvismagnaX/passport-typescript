import mongoose from 'mongoose'

const role = new mongoose.Schema({
    name:{
        type: String,
        unique: true
    },
    createdDate: Date
})

export default mongoose.model("Role",role);