/*
npm 
node package manager
*/

const express = require("express")
const app = express()
const morgan = require("morgan")
const path = require("path")
const mongoose = require("mongoose")
const cors = require('cors')
require("dotenv").config()
const isAdmin = require("./controller/user/auth.controller")
// const userController = require("./controller/user/user.controller")
const userRoutes = require("./controller/user/user.route")
const categoryRoutes = require("./controller/catergory/category.route")
const productroutes = require("./controller/product/product.route")
const { CreateDefaultAdmin } = require("./controller/user/user.controllers")


const port = process.env.PORT || 5000
const dbURL = process.env.DB_URL
mongoose.connect(dbURL)
    .then(() => {
        console.log("database connected successfully")
    })
    .catch((err) => {
        console.log("error is fron connection :", err)
    })

app.use(morgan("dev"))
app.use(cors())


//parse json data
app.use(express.json());


app.use("/api/user", userRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/product", productroutes)

// const userController = require("controller\user\usercontroller.js")
// app.use(userController)
// app.get(function(req,res, next){
//     if(req.query.isAdmin){
//         next()
//     }
//     else{

//     }
// })

app.get("/admin", isAdmin, function (req, res, next) {
    res.json({
        msg: "admin login",
        status: 200
    })
})

// app.use(express.static("upload"))
app.use('/file', express.static(path.join(__dirname, 'upload')))

// app.use(morgan('tiny'))


app.use(function (req, res, next) {
    // console.log("second middleware")
    next({
        Props: req.name,
        msg: "page not found"
    })
    next()
})

app.use(function (err, req, res, next) {
    res.status(err.status || 400)
    res.json({
        text: 'error handling middleware',
        error: err.msg || err,
        status: err.status || 404
    })
})


app.listen(port, function (err, success) {
    if (err) {
        console.log("connection fail!!")
    }
    else {
        console.log("server listening at port", port)
        CreateDefaultAdmin()
    }
})


//middleware
//middleware is a function which has access to request object,response object and next middleware reference
/*
syntax:
function(req, res, next){

}

configuration of middleware
app.use()

types of middleware
1. application level middleware
2. routing level middleware
3. third party middleware
4. inbuilt middleware
5. error handling middleware

*/