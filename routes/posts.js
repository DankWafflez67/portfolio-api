const { check, validationResult } = require('express-validator/check')
const posts = require('../services/posts')
const authenticate = require('../middleware/auth')

module.exports = server => {
  server.get('/posts', (req, res, next) => {
    posts.getPosts(req.query).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
  server.get('/post/:id', (req, res, next) => {
    posts.getPost({ _id: req.params.id }).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
  server.post('/posts', [
      check('title', 'A title is required.').isLength({ min: 1 }),
      check('body', 'The body must be a minimum of 5 characters.').isLength({ min: 5 }),
      check('categories', 'At least one category must be selected.').isLength({ min: 1 }),
      authenticate
    ], (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) return res.status(422).json({ errors: validationErrors.array() })
    posts.createPost(req.body, req.user._id).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
  server.put('/post/:id', [
    check('title', 'A title is required.').isLength({ min: 1 }),
    check('body', 'The body must be a minimum of 5 characters.').isLength({ min: 5 }),
    check('categories', 'At least one category must be selected.').isLength({ min: 1 }),
    authenticate
  ], (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) return res.status(422).json({ errors: validationErrors.array() })
    posts.updatePost(req.params.id, req.body).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
  server.delete('/post/:id', [ authenticate ], async (req, res, next) => {
    posts.removePost(req.params.id).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })

}