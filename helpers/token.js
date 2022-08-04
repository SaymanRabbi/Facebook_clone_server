const jwt = require('jsonwebtoken')

exports.genaretCode = (payload,expire) => {
   return jwt.sign(payload, process.env.SECRET_TOKEN, {
        expiresIn: expire
    })
}