const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var likePostSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },


}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('likePost', likePostSchema);