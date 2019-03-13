const User = require('../models/User')
const auth = require('../services/auth')
const authenticate = require('../middleware/auth')
const { check, validationResult } = require('express-validator/check')

module.exports = server => {
  server.post('/register', [
    check('email').isEmail().withMessage('A valid e-mail address is required to register.')
                  .custom(value => {
                    return User.findOne({ email: value }).then(user => {
                      if(user) {
                        return Promise.reject('That e-mail address is already linked to another account.');
                      }
                    })
                  }),
    check('password').isLength({ min: 6 }).withMessage('Password must be a minimum of 6 characters.'),
    check('name.first').not().isEmpty().withMessage('A first name is required.'),
    check('name.last').not().isEmpty().withMessage('A last name is required.'),
    check('birthday').not().isEmpty().withMessage('A birthday is required.')
  ], (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) return res.status(422).json({ errors: validationErrors.array() })
    auth.registerUser(req.body).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
  server.post('/login', [
    check('email').isEmail().withMessage('E-mail address is invalid.')
                  .not().isEmpty().withMessage('E-Mail address is required.'),
    check('password').isLength({ min: 6 }).withMessage('Password must be a minimum of 6 characters.'),
  ], (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) return res.status(422).json({ errors: validationErrors.array() })
    auth.loginUser(req.body).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
  server.get('/auth/refreshtoken', [ authenticate ], (req, res, next) => {
    auth.refreshToken(req.user).then((response) => {
      res.status(response.status).json(response.data)
    }).catch((response) => {
      console.log(response)
      res.status(response.status).json(response.data)
    })
  })
}