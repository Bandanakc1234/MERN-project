const jwt = require('jsonwebtoken')
const secret_key = process.env.SECRET_KEY;
const User = require('./../model/user.model');

module.exports = (req, res, next) => {
    var token;
    if (req.headers['authorization']) {
        token = req.headers['authorization']
    }
    //x-access-form
    if (req.query.authorization) {
        token = req.query.authorization
    }
    if (token) {
        jwt.verify(token, secret_key, function (err, user) {
            if (err) {
                return next(err)
            }
            // if (user) {
            //     json({
            //         user: user,
            //         status: 200
            //     })
            // }
            //    req.user = user
            User.findById(user._id)
                .then((user) => {
                    if(!user){
                        return next({
                            msg: "user not found/ user removed from the system",
                            status: 400
                        })
                    }
                    // if(user.role != 2){
                    //     return next({
                    //         msg: "you dont have access",
                    //         status: 400
                    //     })
                    // }
                    req.user = user
                    next()
                })
                .catch((err) => {
                    return next(err)
                })
        })
    }
    else {
        return next({
            msg: "token verification failed/token not provide/you don't have access",
            status: 400
        })
    }
}