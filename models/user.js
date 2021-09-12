const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var userSchema = new Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: {
        type: String,
        required: [true, `valid enums are ['MALE', 'FEMALE', 'OTHERS']`],
        enum: ['MALE', 'FEMALE', 'OTHERS']
    },
    password: { type: String, required: true },
    token: { type: String, required: false },
    address: { type: String, required: true },
    country: { type: String, required: true },



}, { versionKey: false })

module.exports = mongoose.model('user', userSchema);