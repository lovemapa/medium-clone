const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var postSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    likes: { type: Number, default: 0 }


}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('post', postSchema);