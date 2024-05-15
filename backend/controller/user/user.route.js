const router = require("express").Router()
const upload = require('./../../middleware/upload')
const authenticate = require("./../../middleware/authenticate")
const { Login, Register, Deleteuser, SingleUserdetail, Updateuser, Alluserdetail, ForgotPassword } = require("./user.controllers")


//login
router.post('/login',Login )

//forgot password
router.put("/forgot_password", ForgotPassword)


//register
router.post('/register',  upload.array('img'), Register)


//get single user details
router.get('/:id',  authenticate, SingleUserdetail)


//delete user
router.delete("/:id",  authenticate, Deleteuser)


//update user
router.put("/:id",  authenticate, Updateuser)


//get all user
router.get('/', authenticate, Alluserdetail )


module.exports = router
