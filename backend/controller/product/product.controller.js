const Product = require("./product.model")
const Category = require('./../catergory/category.model')


const productAdd = (product, reqData) => {
    if (reqData.product_name) {
        product.product_name = reqData.product_name
    }
    if (reqData.product_price) {
        product.product_price = reqData.product_price
    }
    // if (reqData.category_name) {
    //     product.product_category = reqData.category_name
    // }
    if (reqData.product_color) {
        product.product_color = reqData.product_color
    }
    if (reqData.product_description) {
        product.product_description = reqData.product_description
    }
    if (reqData.product_model) {
        product.product_model = reqData.product_model
    }
    if (reqData.product_size) {
        product.product_size = reqData.product_size
    }
    if (reqData.product_tag) {
        product.product_tag = reqData.product_tag.split(",")
    }
    if (reqData.warrentyStatus) {
        product.warrentyStatus = reqData.warrentyStatus
    }
    if (reqData.warrentyPeriod) {
        product.warrentyPeriod = reqData.warrentyPeriod
    }
    if (product.product_discount) {
        product.product_discount = {}
    }
    if (reqData.discountedItem) {
        product.product_discount.discountedItem = reqData.discountedItem
    }
    if (reqData.discountedType) {
        product.product_discount.discountedType = reqData.discountedType
    }
    if (reqData.discountedValue) {
        product.product_discount.discountedValue = reqData.discountedValue
    }
    if (reqData.img) {
        product.product_image = reqData.img
    }
    if (reqData.product_expiry) {
        product.product_expiry = reqData.product_expiry
    }
    if (reqData.vendor) {
        product.vendor = reqData.vendor
    }
    if (reqData.point && reqData.msg) {
        var review = {
            point: reqData.point,
            msg: reqData.msg,
            user: reqData.user
        }
        // product.review = review
        product.review.push(review)
    }
    return product
}


//to add product
exports.AddProduct = (req, res, next) => {
    if (req.fileTypeError) {
        return next({
            msg: "invalid file format",
            status: 404
        })
    }
    const newProduct = new Product({
    })
    if (req.files) {
        req.body.product_image = req.files.map((item) => {
            return item.originalname;
        })
    }
    // req.body.category_name = Category._id
    req.body.vendor = req.user._id

    productAdd(newProduct, req.body)
    newProduct
        .save()
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            next(err)
        })
}

//add review
exports.AddReview = async (req, res, next) => {
    let product = await Product.findById(req.params.product_id)
    if (!product) {
        return next({
            msg: "product not found",
            status: 400
        })
    }
    if (product) {
        if (req.body.point && req.body.msg) {
            let review = {
                point: req.body.point,
                msg: req.body.msg,
                user: req.user._id
            }
            // product.review = review
            product.review.push(review)
        }
        await product.save()
            .then((product) => {
                return res.json(product)
            })
            .catch(err => {
                return next(err)
            })
    }
}


//to view product list
exports.viewProduct = async (req, res, next) => {
    let product = await Product.find()
    // .populate("category", "category_name")
    if (!product) {
        return next({
            msg: "something went wrong",
            status: 400
        })
    }
    res.json(product)
}



//update product
// exports.editProduct = async (req, res, next) => {
//     const product = await Product.findByIdAndUpdate({
//         product_name: req.body.product_name
//     })
//     if (!product) {
//         const product = new Product({
//             product_name: req.body.product_name
//         })
//         await product.save()
//         if (!product) {
//             return next({
//                 msg: "something went wrong",
//                 status: 400
//             })
//         }
//         res.json({
//             msg: "product updated successfully",
//             status: 400
//         })
//     }
//     else {
//         return next({
//             msg: "product already save",
//             status: 400
//         })
//     }
// }


//update product
exports.editProduct = (req, res, next) => {
    Product.findById(req.params.product_id)
        .then((product) => {
            if (!product) {
                return next({
                    msg: "product not found"
                })
            }
            if (product) {
                productAdd(product, req.body)
                product
                    .save()
                    .then((updatedProduct) => {
                        // res.json(updatedProduct)
                        res.json({
                            msg: "Product Updated successfully",
                            status: 200
                        })
                    })
                    .catch(err => next(err))
            }
        })
        .catch(err => next(err))
}


//get single product details
exports.SingleProductDetails = (req, res, next) => {
    var condition = req.params.id
    Product.findById(condition)
        .then((product) => {
            if (!product) {
                return next({
                    msg: "product not found",
                    status: 400
                })
            }
            if (product) {
                res.json(product)
            }
        })
        .catch((err) => {
            return next(err)
        })

}


//delete product
// exports.deleteProduct = (req, res, next) =>{
//     Product.findByIdAndDelete(req.params.id)
//     .then(product => {
//         if(!product) {
//             return next({
//                 msg: "product not found",
//                 status:  400
//             })
//         }
//     })
// }

//delete
exports.deleteProduct = (req, res, next) => {
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            if (!product) {
                return next({
                    msg: "product not found",
                    status: 400
                })
            }
            res.json({
                msg: "product deleted sucessfully",
                deleted_product: product
            })
        })
        .catch(err => next(err))
}


//product search
exports.searchProduct = (req, res, next) => {
    var data = req.body
    var searchCondition = {}
    productAdd(searchCondition, data)
    /*
    $lt
    $gt
    $lte
    $gte
    */

if (data.minprice){
    searchCondition.product_price = {
        $gte:data.minprice
    }
}

if(data.maxPrice){
    searchCondition.product_price={
        $lte:data.maxPrice
    }
}

if(data.minPrice && data.maxPrice){
    searchCondition.product_price={
        $gte:data.minPrice,
        $lte:data.maxPrice
    }
}

if(data.product_color){
    searchCondition.product_color=data.product_color
}

if(data.product_tag){
    searchCondition.product_tag={
        $in:data.product_tag.split(",")
    }
}

if(data.fromDate && data.toDate){
    var fromDate = new Date(data.fromDate).setHours(0,0,0,0) // returns value in milisecond
    var toDate = new Date(data.toDate).setHours(23,59,59,999)

    searchCondition.createdAt={
        $gte:new Date(fromDate),
        $lte:new Date(toDate)
    }
}

    Product.find(searchCondition)
        .then(product => {
            if (!product) {
                return next({
                    msg: "No any product matched yoy search condition",
                    status: 404
                })
            }
            res.json(product)
        })
        .catch(err => {
            next(err)
        })
}