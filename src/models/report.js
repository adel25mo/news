const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    avatarnew:{
        type:Buffer
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Anoc'
    }
},{
    timestamps:true
})
const Rep = mongoose.model('Rep',reportSchema)
module.exports = Rep