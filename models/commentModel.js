const mongoose =  require('mongoose');
const commentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [false, "Username is required"]
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, "Post id is required"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "User id is required"]
    },
    text: {
        type: String,
        required: [true, "Text is required"]
    },
    date_posted: {
        type: Date,
        required: [true, "Date is required"]
    }
})


commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment