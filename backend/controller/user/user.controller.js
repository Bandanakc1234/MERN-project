// const express = require("express")
// const app = express()
// const router = express.Router()
const router = require("express").Router()
const User = require("./../../model/user.model")
const userInformation = require("./../../middleware/user")
const upload = require('./../../middleware/upload')
const passwordHash = require("password-hash")
const jwt = require("jsonwebtoken")
const authenticate = require("./../../middleware/authenticate")



// const upload = multer({ dest: 'uploads/' })


// console.log('__dir : ',__dirname)
// console.log('root directory: ',process.cwd())

//mongoose methods
//find => return array
//finOne => returns object, null
//findById => return object


const createToken = (user) => {
    var token = jwt.sign({
        username: user.username,
        _id: user._id,
        role: user.role
    }, process.env.SECRET_KEY)
    return token;
}


//login
router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (!user) {
                return next({
                    msg: "user not found/invalid username",
                    status: 400
                })
            }
            if (!user.isActivated) {
                return next({
                    msg: "please verify your account first/contact system administration",
                    status: 400
                })
            }
            if (user) {
                // res.send("login sucessfully")
                const checkPassword = passwordHash.verify(req.body.password, user.password)
                if (checkPassword) {
                    var tokens = createToken(user)
                    console.log("token", tokens)
                    res.json({
                        msg: "user Dashboard",
                        token: tokens,
                        user: user.username,
                        status: 200
                    })
                }
                else {
                    return next({
                        msg: "invalid password",
                        status: 400
                    })
                }
            }
        })
        .catch(err => next(err))
})


//register
router.post('/register',  upload.array('img'), function (req, res, next) {
    // console.log(req.body)
    console.log(req.files)

    if (req.fileTypeError) {
        return next({
            msg: "invalid file format",
            status: 404
        })
    }
    const newUser = new User({

    })
    if (req.files) {
        // const mimeType = req.file.mimetype.split('/')[0]
        // // "image/jpeg"
        // // [image, jpeg]
        // // console.log(mimeType)
        // if(mimeType !== "image"){
        //     // fs module inject garerw invalid delete  garne
        //     return next({
        //         msg:"invalid file format",
        //         status:404
        // })
        // }
        req.body.image = req.files.map((item) => {
            return item.originalname;
        })
    }
    req.body.password = passwordHash.generate(req.body.password)
    userInformation(newUser, req.body)
    newUser
        .save()
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            next(err)
        })
})


//get single user details
router.get('/:id',  authenticate, function (req, res, next) {
    var condition = { _id: req.params.id }
    User.findById(condition)
        .then((user) => {
            if (!user) {
                return next({
                    msg: "user not found",
                    status: 400
                })
            }
            if (user) {
                res.json(user)
            }
        })
        .catch((err) => {
            return next(err)
        })

})



//delete user
router.delete("/:id",  authenticate, function (req, res, next) {
    console.log(req.user.username)
    User.findByIdAndDelete(req.params.id)
        .then((user) => {
            if (!user) {
                return next({
                    msg: "user not found",
                    status: 404
                })
            }
            if (user) {
                res.json(user)
            }
            //     if(!user){
            //         return next({
            //             msg:"user not found",
            //             status: 404
            //         })
            //     }
            //     if(user){
            //         user.remove()
            //         .then(userInfo =>{
            //             res.json(userInfo)
            //         })
            //         .catch(err=> next(err))
            //     }
        })
        .catch(err => next(err))
})


//update user
router.put("/:id",  authenticate, function (req, res, next) {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                return next({
                    msg: "User not found"
                })
            }
            if (user) {
                userInformation(user, req.body)

                // const updateUser = new User({
                // })
                // if (req.body.username) {
                //     user.username = req.body.username
                // }
                // if (req.body.email) {
                //     user.email = req.body.email
                // }
                // if (req.body.password) {
                //     user.password = req.body.password //todo:hash password
                // }
                // if (req.body.gender) {
                //     user.gender = req.body.gender
                // }
                // user.address = {}
                // if (req.body.temporary_aadress) {
                //     user.address.tempAddress = req.body.temporary_aadress.split(",")
                // }
                // if (req.body.permanent_address) {
                //     user.address.permanentAddress = req.body.permanent_address
                // }
                // if (req.body.role) {
                //     user.role = req.body.role
                // }
                user
                    .save()
                    .then((updateUsers) => {
                        res.json(updateUsers)
                    })
                    .catch(err => next(err))
            }
        })
        .catch(err => next(err))
})


//get all user
router.get('/', authenticate, function (req, res, next) {
    var condition = {}
    User.find(condition, {
        // username: 0
    })
        // .then((users)=>{
        //     res.json(users)
        // })
        // .catch((err) => {
        //     return next(err)
        // })
        .sort({
            _id: -1
        })

        .exec()
        .then((users) => {
            if (!users) {
                return next({
                    msg: "user not found"
                })
            }
            if (users) {
                res.json(users)
            }
        })
        .catch((err) => {
            return next(err)
        })

    })

    // callback
    // .exec(function(err, users){
    //     if(err){
    //         return next(err)
    //     }
    //     if(!user){
        // }) 
    //         return next({
    //             masg:"user not found"
    //         })
    //     }
    //     if(users) {
    //         res.json(users)
    //     }




//user.js

// newUser.username = req.body.username
// newUser.email = req.body.email
// newUser.password = req.body.password //todo hash password
// newUser.gender = req.body.gender
// newUser.address = {}
// if (req.body.temporary_aadress) {
//     newUser.address.tempAddress = req.body.temporary_aadress.split(",")
// }
// newUser.address.permanentAddress = req.body.permanent_address
// newUser.role = req.body.role






// router.route("/profile")
//     .get(function (req, res, next) {
//         res.json({
//             msg: "view user data",
//             status: 200
//         })
//     })
//     .post(function (req, res, next) {
//         res.send("save user data")
//     })
//     .put(function (req, res, next) {
//         res.send("update user data")
//     })
//     .delete(function (req, res, next) {
//         res.send("delete user data")
//     })
// router.get("/profile", function(req,res,next){
//     res.send("user")
// })

// router.post("/profile", function(req,res,next){
//     res.send("user profile post")
// })

// router.put("/profile", function(req,res,next){
//     res.send("user profile post")
// })

// router.delete("/profile", function(req,res,next){
//     res.send("user profile post")
// })

// router.get("/search", function (req, res, next) {
//     res.json({
//         msg: "search result"
//     })
// })

// router.get("/:id", function (req, res, next) {
//     res.json({
//         msg: "user id",
//         id: req.params.id
//     })
// })



// router.get('/', function (request, response) {
//     response.send("run home page using nodemon package")
//     /*response methods
//     res.render()
//     res.download()
//     res.status()
//     res.json()
//     res.send()
//     res.end()
//     */
// })

// router.get('/help', function (request, response) {
//     // response.send("help page")
//     response.json({
//         msg: 'from help page'
//     })
// })

// router.get("/contact", function (err, res) {
//     res.send("contact page")
// })

// router.get("/profile/:name", function (req, res, next) {
//     res.json({
//         msg: req.params.name + " profile",
//         params: req.params,
//         query: req.query

//     })
// })


// router.get("/:content", function (req, res, next) {
//     res.send("from dynamic handler")
// })

// middleware
// router.use(function(req, res, next){
//     console.log("first middleware")
//     // res.send("blocked at the first middleware")
//     req.name = "vedu"
//     next()
// })

// router.use(function (req, res, next) {
//     // console.log("second middleware")
//     res.json({
//         Props: req.name,
//         msg: "didnot match endpoint"
//     })
//     next()
// })

module.exports = router
