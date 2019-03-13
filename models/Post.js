const mongoose = require('mongoose')
const timestamp =  require('mongoose-timestamp')
const mongoosePaginate = require('mongoose-paginate')

const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
  author: mongoose.Schema.Types.ObjectId,
  categories: Array,
  rating: {
    likes: Number,
    dislikes: Number,
  },
})

PostSchema.plugin(timestamp)
PostSchema.plugin(mongoosePaginate)

const Post = mongoose.model('Post', PostSchema)
module.exports = Post