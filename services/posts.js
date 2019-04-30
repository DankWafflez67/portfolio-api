const Post = require('../models/Post')
const User = require('../models/User')
const Category = require('../models/Category')
const mongoose = require('mongoose');
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
  ).then((dbPosts) => {
    const posts = [];
    dbPosts.docs.forEach((post) => {
      posts.push(formatPost(post))
    })
    Promise.all(posts).then((data) => {
      const response = {
        status: 200,
        data: {
          message: 'Success!',
          totalPosts: dbPosts.total,
          posts: data
        }
      }
      resolve(response)
    }).catch((err) => {
      reject(error500(err))
    })
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

const formatPost = async (postData) => {
  try {
    // Convert the category id's into "mongoose" id's
    const categoryIds = postData.categories.map(id => mongoose.Types.ObjectId(id));
    
    // Get names of categories instead of id's
    const categories = await Category.find({_id: {"$in": categoryIds}}).exec();

    // Get the author of the post
    const author = await User.findById(postData.author).exec();
    
    return {
      slug: postData.slug,
      title: postData.title,
      body: postData.body,
      categories: categories.map(c => c.name), // convert our array of objects into a array of names
      author: {
        email: author.email,
        name: author.name
      },
      createdAt: moment(postData.createdAt).fromNow(),
      updatedAt: moment(postData.createdAt).fromNow()
    };
  } catch(err){
    // Return the error message, not 100% sure the best way to handle this.
    return error500(err);
  }
};

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