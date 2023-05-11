const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photosSchema = new Schema({
    movie:{
        type:String,
        required:true
    },
    image:{
            type:String
        },
    uploader:{
        type:String
    },
    date:{
        type:Date,
    },
    filename:{
        type:String
    }
});

module.exports = mongoose.model("Photo", photosSchema);