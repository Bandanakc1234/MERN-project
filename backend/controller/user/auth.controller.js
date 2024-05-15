module.exports = function(req, res, next){
    if(req.query.isAdmin == 'bandana'){
        next()
    }
    else{
        next({
            msg: "you don't have access",
            status: 404
        })
    }
}