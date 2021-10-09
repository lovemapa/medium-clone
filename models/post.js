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


}, { timestamps: true, versionKey: false })


postSchema.set('toJSON', {
    virtuals: true
});

// postSchema.virtual('totalLikes', {
//     ref: 'likePost',
//     localField: '_id',
//     foreignField: 'post',
//     count: true

// })

module.exports = mongoose.model('post', postSchema);