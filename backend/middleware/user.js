module.exports = function(user, reqData){
    if (reqData.username) {
        user.username = reqData.username
    }
    if (reqData.email) {
        user.email = reqData.email
    }
    if (reqData.password) {
        user.password = reqData.password //todo:hash password
    }
    if (reqData.gender) {
        user.gender = reqData.gender
    }
    user.address = {}
    if (reqData.temporary_aadress) {
        user.address.tempAddress = reqData.temporary_aadress.split(",")
    }
    if (reqData.permanent_address) {
        user.address.permanentAddress = reqData.permanent_address
    }
    if (reqData.role) {
        user.role = reqData.role
    }
    if(reqData.image){
        user.image = reqData.image
    }
    if(reqData.isActivated){
        user.isActivated = reqData.isActivated
    }

}     

