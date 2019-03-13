const Category = require('../models/Category')

const getCategories = () => new Promise((resolve, reject) => {
  Category.find().then((categories) => {
    const response = {
      status: 200,
      data: {
        categories
      }
    }
    resolve(response)
  }).catch((err) => {
    console.log(err)
    const response = {
      status: 500,
      data: {
        error: '500 Internal server error.',
        data: err
      }
    }
    reject(response)
  })
})

const addCategory = (requestBody) => new Promise((resolve, reject) => {
  const newCategory = new Category({
    name: requestBody.name
  })
  newCategory.save().then((category) => {
    const response = {
      status: 201,
      data: {
        success: 'Category was successfully created!',
        data: category
      }
    }
    resolve(response)
  }).catch((err) => {
    console.log(err)
    const response = {
      status: 500,
      data: {
        error: '500 Internal server error.',
        data: err
      }
    }
    reject(response)
  })
})

const updateCateogry = (categoryId, requestBody) => new Promise((resolve, reject) => {
  Category.findByIdAndUpdate(categoryId, { name: requestBody.name }, { new: true }).then((category) => {
    if(category){
      const response = {
        status: 200,
        data: {
          success: 'Category was successfully updated!',
          data: category
        }
      }
      resolve(response)
    } else {
      const response = {
        status: 404,
        data: {
          error: 'No category found for that id.'
        }
      }
      reject(response)
    }
  }).catch((err) => {
    console.log(err)
    const response = {
      status: 500,
      data: {
        error: '500 Internal server error.',
        data: err
      }
    }
    reject(response)
  })
})

const deleteCategory = (categoryId) => new Promise((resolve, reject) => {
  Category.findByIdAndRemove(categoryId).then((category) => {
    if(category){
      const response = {
        status: 200,
        data: {
          success: 'Category was successfully deleted!'
        }
      }
      resolve(response)
    } else {
      const response = {
        status: 404,
        data: {
          error: 'No category found for that id.'
        }
      }
      reject(response)
    }
  }).catch((err) => {
    console.log(err)
    const response = {
      status: 500,
      data: {
        error: '500 Internal server error.',
        data: err
      }
    }
    reject(response)
  })
})

module.exports = {
  getCategories,
  addCategory,
  updateCateogry,
  deleteCategory
}