const { check, validationResult } = require('express-validator/check')
const comments = require('../services/comments')
const authenticate = require('../middleware/auth')

module.exports = server => {

  //Get Comments 
  server.get('/post/:postId/comments', (req, res, next) => {
    comments.getComments(req.params.postId, req.query).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
 
  //Get Replies
  server.get('/comment/:commentId/replies', (req, res, next) => {
    comments.getReplies(req.params.commentId, req.body).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })

  //Add Comment 
  server.post('/post/:postId/comments', [
    check('name').not().isEmpty().withMessage('A name is required.'),
    check('email').isEmail().withMessage('A valid e-mail address is required.'),
    check('body').isLength({min: 5}).withMessage('Your comment must be at least 5 characters.')
  ] , (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) return res.status(422).json({ errors: validationErrors.array() })
    comments.addComment(req.params.postId, req.body, req.ip).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })

  //Update Comment

  server.put('/comment/:commentId', [
    check('name').not().isEmpty().withMessage('A name is required.'),
    check('email').isEmail().withMessage('A valid e-mail address is required.'),
    check('body').isLength({min: 5}).withMessage('Your comment must be at least 5 characters.')
  ] , (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) return res.status(422).json({ errors: validationErrors.array() })
    comments.editComment(req.params.commentId, req.body, req.ip).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })

  //Delete Comment
  server.delete('/comment/:commentId', (req, res, next) => {
    comments.deleteComment(req.params.commentId).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
}
