const User = require('../models/User')
const { verifyToken } = require('../services/auth')

module.exports = function authenticate(req, res, next)
{
  if(!req.headers.authorization) return res.status(401).json({message: "You must be logged in to complete this action."})
  if (req.headers.authorization.startsWith("Bearer ")){
    token = req.headers.authorization.substring(7, req.headers.authorization.length)
    verifyToken(token)
      .then((decodedToken) => {
        User.findById(decodedToken.user_id).then((user) => {
          req.user = user
          next()
        }).catch((err) => {
          console.log(err)
          res.status(500).json({
            error: '500 Internal server error.',
            data: err
          })
        })
      }).catch((err) => {
        res.status(401).json({message: "You must be logged in to complete this action."})
      })
  }
}
