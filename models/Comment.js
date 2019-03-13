const mongoose = require('mongoose')
const timestamp =  require('mongoose-timestamp')
const mongoosePaginate = require('mongoose-paginate')

const CommentSchema = new mongoose.Schema({
  email: String,
  name: String,
  ipAddress: String,
  postId: mongoose.Schema.Types.ObjectId,
  commentId: { type: mongoose.Schema.Types.ObjectId, default: null }, 
  body: String,
  likes: { type: Number, default: 0 },
  replies: { type: Number, default: 0 }
})

CommentSchema.plugin(timestamp)
CommentSchema.plugin(mongoosePaginate)

const Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment