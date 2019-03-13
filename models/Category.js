const mongoose = require('mongoose')
const timestamp =  require('mongoose-timestamp')
const mongoosePaginate = require('mongoose-paginate')

const CategorySchema = new mongoose.Schema({
  name: String
})

CategorySchema.plugin(timestamp)
CategorySchema.plugin(mongoosePaginate)

const Category = mongoose.model('Category', CategorySchema)
module.exports = Category