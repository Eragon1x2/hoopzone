const mongoose = require('mongoose');

/*
Ось як виглядатиме документ для MongoDB, який зберігатиме об'єкт поста соцмережі для баскетболістів:

{
  "author": "JohnDoe23",
  "title": "Amazing Dunk Last Night!",
  "content": "Check out my insane dunk during last night's game! 🏀🔥",
  "image_url": "https://example.com/images/dunk.jpg",
  "video_url": "https://example.com/videos/dunk.mp4",
  "likes": 154,
  "comments": [
    {
      "username": "BasketFan99",
      "text": "That was epic! 🔥",
      "date_posted": "2024-12-26T20:45:00"
    },
    {
      "username": "HoopsMaster",
      "text": "Best dunk I've seen all season. 💪",
      "date_posted": "2024-12-26T21:10:00"
    }
  ],
  "tags": ["#basketball", "#dunk", "#NBA"],
  "date_posted": "2024-12-26T19:30:00"
}
*/
const postSchema = new mongoose.Schema({
    author: {
        type: String,
        required: [true, "Author is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Author id is required"]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    image_url: {
        type: String,
        required: false
    },
    video_url: {
        type: String,
        required: false
    },
    likes: {
        type: Number,
        default: 0
    },
    tags: {
        type: Array,
        required: false
    },
    date_posted: {
        type: Date,
        required: false,
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'post',
    localField: '_id'
})
postSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
})
const Post = mongoose.model('Post', postSchema);

module.exports = Post;