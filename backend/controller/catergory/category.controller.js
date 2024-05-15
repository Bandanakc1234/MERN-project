const Category = require("./category.model")


//to create new category
exports.addCategory = async (req, res, next) => {
    let category = await Category.findOne({ category_name: req.body.category_name })
    if (!category) {
        const category = new Category({
            category_name: req.body.category_name
        })
        //category.categoery_name = req.body.category_name
        await category.save()
        if (!category) {
            return next({
                msg: "something went wrong",
                status: 400
            })
        }
        res.json({
            category: category,
            msg: "category added successfully"
        })
    }
    else {
        return next({
            msg: "Category already exit",
            status: 400
        })
    }


}

//view all category
exports.viewCategory = async (req, res, next) => {
    let category = await Category.find()
    if (!category) {
        return next({
            msg: "something went wrong",
            status: 400
        })
    }
    res.json(category)
}

//get single product details
exports.SingleCategoryDetails = (req, res, next) => {
    var condition = req.params.id
    Category.findById(condition)
        .then((category) => {
            if (!category) {
                return next({
                    msg: "category not found",
                    status: 400
                })
            }
            if (category) {
                res.json(category)
            }
        })
        .catch((err) => {
            return next(err)
        })

}


//update the category
// exports.updateCategory = (req, res, next) =>{
//     Category.findByIdAndUpdate(req.params.id,{
//         category_name: req.body.category_name
//     }, {new: true})
//     .then((category) =>{
//         if(!category){
//             return next({
//                 msg:"category not found",
//                 status: 400
//             })
//         }
//         res.json({ category })
//     })
//     .catch(err =>next(err))
// }

// exports.updateCategory = (req, res, next) =>{
//     Category.findOne({category_name: req.body.category_name})
//     .then(category =>{
//         if(!category){
//             return next({
//                 msg: "category not found",
//                 status: 400
//             })
//         }
//         res.json({
//             msg: "category updated",
//             status: 400
//         })

//     })
//     .catch(err => next(err))
// }


//update
exports.editCategory = async (req, res, next) => {
    const category = await Category.findOneAndUpdate({ category_name: req.body.category_name })
    if (!category) {
        const category = new Category({
            category_name: req.body.category_name
        })
        //category.categoery_name = req.body.category_name
        await category.save()
        if (!category) {
            return next({
                msg: "something went wrong",
                status: 400
            })
        }
        res.json({
            msg: " category updated successfully",
            status: 400
        })
    }
    else {
        return next({
            msg: "Category already saved",
            status: 400
        })
    }
}


//delete category
exports.deleteCategory = (req, res, next) => {
    Category.findByIdAndDelete(req.params.id)
        .then(category => {
            if (!category) {
                return next({
                    msg: "category not found",
                    status: 400
                })
            }
            res.json({
                msg: "category deleted sucessfully",
                deleted_category: category
            })
        })
        .catch(err => next(err))
}