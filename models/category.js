const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const categorySchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },


}, { versionKey: false })

module.exports = mongoose.model('category', categorySchema);