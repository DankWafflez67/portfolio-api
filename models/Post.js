const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const timestamp =  require('mongoose-timestamp')
const mongoosePaginate = require('mongoose-paginate')

mongoose.plugin(slug)

const PostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, slug: "title", unique: true },
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