const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mapSchema = new Schema({
    name:{
        type:String
    },
    latitude:{
        type:Number
    },
    longitude:{
        type:Number
    }
});

module.exports = mongoose.model("Map", mapSchema);