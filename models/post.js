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

postSchema.virtual('totalLikes', {
    ref: 'likePost',
    localField: '_id',
    foreignField: 'post',
    count: true
})

postSchema.virtual('isLiked', {
    ref: 'likePost',
    localField: '_id',
    foreignField: 'post',

}).get(val => {
    if (val) {
        if (val.length >= 1)
            val.isLiked = true
        else
            val.isLiked = false
        return val.isLiked

    }
})

module.exports = mongoose.model('post', postSchema);