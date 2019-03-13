const category = require('../services/categories')
const { check, validationResult } = require('express-validator/check')
const authenticate = require('../middleware/auth')


module.exports = server => {
  server.get('/categories', (req, res, next) => {
    category.getCategories().then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      res.status(response.status).json(response.data)
    })
  })
  server.post('/categories', [
    check('name').not().isEmpty().withMessage('A category name is required.'),
    authenticate
  ], (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) return res.status(422).json({ errors: validationErrors.array() })
    category.addCategory(req.body).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      res.status(response.status).json(response.data)
    })
  })
  server.put('/category/:categoryId', [
    check('name').not().isEmpty().withMessage('A category name is required.'),
    authenticate
  ], (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) return res.status(422).json({ errors: validationErrors.array() })
    category.updateCateogry(req.params.categoryId, req.body).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      res.status(response.status).json(response.data)
    })
  })
  server.delete('/category/:categoryId', [ authenticate ], (req, res, next) => {
    category.deleteCategory(req.params.categoryId).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      res.status(response.status).json(response.data)
    })
  })
}