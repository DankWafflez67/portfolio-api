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
  server.get('/post/:slug', (req, res, next) => {
    posts.getPost({ slug: req.params.slug }).then((response) => {
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
  server.put('/post/:slug', [
    check('title', 'A title is required.').isLength({ min: 1 }),
    check('body', 'The body must be a minimum of 5 characters.').isLength({ min: 5 }),
    check('categories', 'At least one category must be selected.').isLength({ min: 1 }),
    authenticate
  ], (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) return res.status(422).json({ errors: validationErrors.array() })
    posts.updatePost(req.params.slug, req.body).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
  server.delete('/post/:slug', [ authenticate ], async (req, res, next) => {
    posts.removePost(req.params.slug).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
  server.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'Welcome to the api.'
    })
  })
}