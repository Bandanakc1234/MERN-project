const multer = require("multer")
const path = require("path")


    const my_store = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null,path.join(process.cwd(),'/uploads'))
        },
        filename: function(req,file,cb){
            cb(null, Date.now()+ "-" +file.originalname)
        }
    })
    
    const fileType = (req, file, cb) =>{
        const mimeType = file.mimetype.split('/')[0]
        if(mimeType !== "image"){
            req.fileTypeError = true;
            cb(null, false)
        }
        else{
            cb(null, true)
        }
    }
    
    const upload = multer({
        storage: my_store,
        fileFilter: fileType
    })
    module.exports = upload;

