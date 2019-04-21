const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config')
const fs = require('fs')

const saltRounds = 10
const certPrivateKey = fs.readFileSync(config.CERT_PRIVATE_KEY_PATH);
const certPublicKey = fs.readFileSync(config.CERT_PUBLIC_KEY_PATH);

const verifyToken = token => new Promise((resolve, reject) => {
  jwt.verify(token, certPublicKey, function(err, decoded) {
    if(err) {
      return reject(err)
    }
    resolve(decoded)
  })
})

function createToken(payload, options)
{
  return new Promise((resolve, reject) => {
    jwt.sign(payload, certPrivateKey, options, (err, token) => {
      if(token){
          resolve(token)
      } else {
        console.log(err)
        reject(err)
      }
    })
  })
}

const refreshToken = user => new Promise((resolve, reject) => {
  const payload = {
    user_id: user._id,
    email: user.email
  }
  createToken(payload, { expiresIn: '2h', algorithm: 'RS256' }).then((token) => {
    const response = {
      status: 200,
      data: {
        success: 'Refresh successful!',
        token
      }
    }
    resolve(response)
  }).catch((err) => {
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

const loginUser = requestBody => new Promise((resolve, reject) => {
  const { email, password } = requestBody
  User.findOne({ email }).then((user) => {
    if(user) {
      bcrypt.compare(password, user.password).then((match) => {
        if(match) {
          const payload = {
            user_id: user._id,
            email: user.email
          }
          createToken(payload, { expiresIn: '2h', algorithm: 'RS256' }).then((token) => {
            const response = {
              status: 200,
              data: {
                success: 'Authentication successful!',
                token
              }
            }
            resolve(response)
          }).catch((err) => {
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
            status: 401,
            data: {
              error: 'Incorrect password.'
            }
          }
          reject(response)
        }
      })
    } else {
      const response = {
        status: 404,
        data: {
          error: 'No user was found with that e-mail address.'
        }
      }
      reject(response)
    }
  })
})

const registerUser = requestBody => new Promise((resolve, reject) => {
  const { email, password, name: { first, last }, birthday } = requestBody
  bcrypt.hash(password, saltRounds).then((hash) => {
    const buildUser = new User({
      email,
      password: hash,
      name: {
        first,
        last
      },
      birthday
    })
    buildUser.save().then((user) => {
      const response = {
        status: 201,
        data: {
          success: 'Registration was successful.',
          data: user
        }
      }
      resolve(response)
    })
    .catch((err) => {
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
  .catch((err) => {
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
  verifyToken,
  createToken,
  refreshToken,
  loginUser,
  registerUser
}