const Comment = require('../models/Comment')

const getComment = (commentId) => new Promise((resolve, reject) => {
  Comment.findById(commentId).then((comment) => {
    const response = {
      status: 200,
      data: {
        comment
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

const getComments = (postId, requestQuery) => new Promise((resolve, reject) => {
  if(requestQuery.limit){
    requestQuery.limit = requestQuery.limit > 25 ? 25 : requestQuery.query.limit
  } else {
    requestQuery.limit = 10
  }
  Comment.paginate({ postId, commentId: null }, {
    sort: {
      createdAt: 'desc'
    },
    page: requestQuery.page || 1,
    limit: requestQuery.limit
  }).then((comments) => {
    const response = {
      status: 200,
      data: {
        comments
      }
    }
    resolve(response)
  }).catch((err) => {
    console.log(err)
    const response = {
      status: 500,
      data: {
        error: 'Interntal server error',
        data: err
      }
    }
    reject(response)
  })
})

const getReplies = (commentId, requestQuery) => new Promise((resolve, reject) => {
  if(requestQuery.limit){
    requestQuery.limit = requestQuery.limit > 25 ? 25 : requestQuery.query.limit
  } else {
    requestQuery.limit = 10
  }
  Comment.paginate({ commentId }, {
    sort: {
      createdAt: 'desc'
    },
    page: requestQuery.page || 1,
    limit: requestQuery.limit
  }).then((comments) => {
    const response = {
      status: 200,
      data: {
        comments
      }
    }
    resolve(response)
  }).catch((err) => {
    console.log(err)
    const response = {
      status: 500,
      data: {
        error: 'Interntal server error',
        data: err
      }
    }
    reject(response)
  })
})

const incrementReplies = (commentId) => new Promise((resolve, reject) => {
  Comment.findByIdAndUpdate(commentId, { $inc: { replies: 1 } }, { select: 'replies' }).then((repliesCount) => {
    resolve(repliesCount)
  }).catch((err) => {
    console.log(err)
    reject(response)
  })
})

const decrementReplies = (commentId) => new Promise((resolve, reject) => {
  Comment.findByIdAndUpdate(commentId, { $inc: { replies: -1 } }, { select: 'replies' }).then((repliesCount) => {
    resolve(repliesCount)
  }).catch((err) => {
    console.log(err)
    reject(response)
  })
})

const addComment = (postId, requestBody, ipAddress) => new Promise((resolve, reject) => {
  const { email, name, body } = requestBody
  const constructComment = new Comment({
    name,
    email,
    ipAddress,
    postId,
    commentId: requestBody.commentId ? requestBody.commentId : null,
    body
  })
  constructComment.save().then((newComment) => {
    if(newComment.commentId){
      incrementReplies(newComment.commentId).then((repliesCount) => {
        //Success
      }).catch((err) => {
        console.log(err)
      })
    }
    const response = {
      status: 201,
      data: {
        success: 'Comment was successfully added.',
        data: newComment
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

const editComment = (commentId, requestBody, ipAddress) => new Promise((resolve, reject) => {
  const { email, name, body } = requestBody
  const constructComment = {
    name,
    email,
    ipAddress,
    body
  }
  Comment.findByIdAndUpdate(commentId, constructComment, { new: true }).then((newComment) => {
    if(newComment){
      const response = {
        status: 201,
        data: {
          success: 'Comment was successfully updated.',
          data: newComment
        }
      }
      resolve(response)
    } else {
      const response = {
        status: 404,
        data: {
          error: 'Could not find comment with that id.'
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

const deleteComment = commentId => new Promise((resolve, reject) => {
  Comment.findByIdAndDelete(commentId).then((comment) => {
    if(comment){
      if(comment.commentId){
        decrementReplies(comment.commentId).then((repliesCount) => {
          //Success
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
      }
      const response = {
        status: 200,
        data: {
          success: 'Comment was successfully deleted.'
        }
      }
      resolve(response)
    } else {
      reject(err)
    }
  }).catch((err) => {
    console.log(err)
    reject(err)
  })
})

module.exports = {
  getComment,
  getComments,
  getReplies,
  addComment,
  editComment,
  deleteComment
}