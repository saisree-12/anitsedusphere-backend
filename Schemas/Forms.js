const mongoose = require('mongoose')

const Form = new mongoose.Schema({
    formname:String,
    columns:Object,
    desc:String,
    role:String
})

module.exports = mongoose.model('forms',Form) 