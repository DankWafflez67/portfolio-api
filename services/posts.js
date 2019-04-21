const slugify = require('slugify')
const Post = require('../models/Post')

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
        message: 'Hello world!',
        posts
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
      const response = {
        status: 200,
        data: {
          post
        }
      }
      resolve(response)
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

const updatePost = (postId, requestBody) => new Promise((resolve, reject) => {
  const { title, body, categories } = requestBody
  Post.findOneAndUpdate( { _id: postId}, {title, body, categories}, { new: true }).then((updatedPost) => {
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

const removePost = (postId) => new Promise((resolve, reject) => {
  Post.findOneAndDelete({ _id: postId }).then((post) => {
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

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  removePost
}