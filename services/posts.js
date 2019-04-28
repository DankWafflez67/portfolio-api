const Post = require('../models/Post')
const User = require('../models/User')
const Category = require('../models/Category')
const moment = require('moment')

const getPosts = (requestQuery) => new Promise((resolve, reject) => {
  if(requestQuery.limit){
    requestQuery.limit = requestQuery.limit > 25 ? 25 : requestQuery.query.limit
  } else {
    requestQuery.limit = 10
  }
  Post.paginate(null, {
      select: '-comments',
      sort: {
        createdAt: 'desc'
      },
      page: requestQuery.page || 1,
      limit: requestQuery.limit
    }
  ).then((posts) => {
    const response = {
      status: 200,
      data: {
        message: 'Success!',
        posts: posts.docs
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

const getPost = (whereQuery) => new Promise((resolve, reject) => {
  Post.findOne(whereQuery, '-comments').then((post) => {
    if(post) {
      formatPost(post).then((post) => {
        const response = {
          status: 200,
          data: {
            post
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
    } else {
      const response = {
        status: 404,
        data:{
          error: '404 Post could not be located.'
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

const createPost = (requestBody, authorId) => new Promise((resolve, reject) => {
  const { title, body, categories } = requestBody
  const constructPost = new Post({
    title,
    body,
    categories,
    author: authorId
  })
  constructPost.save().then((newPost) => {
    const response = {
      status: 201,
      data: {
        success: 'Post was successfully created.',
        data: newPost
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

const updatePost = (postSlug, requestBody) => new Promise((resolve, reject) => {
  const { title, body, categories } = requestBody
  Post.findOneAndUpdate( { slug: postSlug }, {title, body, categories}, { new: true }).then((updatedPost) => {
    if(updatedPost){
      const response = {
        status: 200,
        data: {
          success: 'Post was successfully updated.',
          data: updatedPost
        }
      }
      resolve(response)
    } else {
      const response = {
        status: 404,
        data: {
          error: '404 Post could not be located.'
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

const removePost = (postSlug) => new Promise((resolve, reject) => {
  Post.findOneAndDelete({ slug: postSlug }).then((post) => {
    if(post) {
      const response = {
        status: 200,
        data: {
          success: 'Post was successfully deleted.'
        }
      }
      resolve(response)
    } else {
      const response = {
        status: 404,
        data: {
          error: '404 Post could not be located.'
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

const formatPost = (postData) => new Promise((resolve, reject) => {
  //Get names of categories instead of id's
  const categories = []
  postData.categories.forEach((catId) => {
    Category.findById(catId).then((category) => {
      if(category) categories.push(category.name)
    }).catch((err) => {
      console.log(err)
    })
  })
  //Pull in author's information.
  console.log(categories)
  Promise.all(categories).then((categories) => {
    console.log(categories)
    User.findById(postData.author).then((user) => {
      const response = {
        slug: postData.slug,
        title: postData.title,
        body: postData.body,
        categories: categories,
        author: {
          email: user.email,
          name: user.name
        },
        createdAt: moment(postData.createdAt).fromNow(),
        updatedAt: moment(postData.createdAt).fromNow()
      }
      resolve(response)
    }).catch((err) => {
      const response = error500(err)
      reject(response)
    })
  })
})

const error500 = (error = '') => {
  console.log(error)
  return {
    status: 500,
    data: {
      error: '500 Internal server error.',
      data: error
    }
  }
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  removePost
}