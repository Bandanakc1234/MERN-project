const jwt = require("jsonwebtoken")
const User = require("./../../model/user.model")
const userInformation = require("./../../middleware/user")
const passwordHash = require("password-hash")
const nodemailer = require("nodemailer")

const createToken = (user) => {
    var token = jwt.sign({
        username: user.username,
        _id: user._id,
        role: user.role
    }, process.env.SECRET_KEY)
    return token;
}


//login
exports.Login = (req, res, next) => {
    User.findOne({
        $or: [
            { username: req.body.username },
            { email: req.body.username }
        ]
    })
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
                console.log("login here")
                const checkPassword = passwordHash.verify(req.body.password, user.password)
                if (checkPassword) {
                    var tokens = createToken(user)
                    res.json({
                        msg: "user Dashboard",
                        token: tokens,
                        user_details: {
                            username: user.username,
                            role: user.role,
                        },
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
}

//create default user
exports.CreateDefaultAdmin = (req, res, next) => {
    const user = User.findOne({ role: "admin1" })
    if (!user) {
        var passwordHash = passwordHash.generate("admin")
        const adminUser = new User({
            username: "jsadmin",
            password: passwordHash,
            role: "admin",
            email: "jsadmin0@gmail.com"
        })
        adminUser.save()
    }

}


//register
exports.Register = (req, res, next) => {
    console.log(req.files)

    if (req.fileTypeError) {
        return next({
            msg: "invalid file format",
            status: 404
        })
    }
    const newUser = new User({})
    if (req.files) {
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
}

//deleteuser
exports.Deleteuser = (req, res, next) => {
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

        })
        .catch(err => next(err))
}

//get single user data
exports.SingleUserdetail = (req, res, next) => {
    var condition = req.params.id
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

}


//update user data
exports.Updateuser = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                return next({
                    msg: "User not found"
                })

            }
            if (user) {
                userInformation(user, req.body)
                user
                    .save()
                    .then((updateUsers) => {
                        res.json(updateUsers)
                    })
                    .catch(err => next(err))
            }
        })
        .catch(err => next(err))
}

//get all user data
exports.Alluserdetail = (req, res, next) => {
    var condition = {}
    User.find(condition, {
    })
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
}



//forgot password
const sender = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user: "kcbandana55@gmail.com", //Your email address
        pass: "diwhixpteyxwolvo"
    }
  });

  const mailDatas = (data) =>{
    const mailData = {
        from: 'OurStore', // sender address
        to: "kcbandana55@gmail.com"+ "pradhan.adity2016@gmail.com"+ "ommanijs@gmail.com" + data.mail, // list of receivers
        subject: "Hello ✔,"+ data.username, // Subject line
        text: "Hello world?", // plain text body
        html: `
        <p>Hi<strong>${data.name}</strong>,</p>
        <p>we noticed that you are having trouble logging into our system please use link below to reset your password</p>
        <p><a href="${data.link} >click here to reset your password</a></p>
        <p>if you have not requested to reset passord please kindly ignore this email</p>
        <p>regards,</p>
        <p>Vedu</p>
        <p>MERN stack Team</p>`, //html body
    }
    return mailData;
  }


exports.ForgotPassword = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return next({
                    msg: "User Not Found",
                })
            }
            //prepare mail
            //send mail to user
            var mailData = {
                email: user.email,
                username:user.username,
                link: `${req.headers.origin}/reset_password/${user.id}`
            }
            sender.sendMail(mailDatas(mailData))
            .then(response =>{
                response.json({
                    msg: "success in sending msil",
                    status: 200
                })
                
            })
            .catch(err =>{
                return next(err)
            })
        })
        .catch((err) => {
            return next(err)
        })
}
