const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const Product = require('../models/product')
const {errorHandler} = require('../helpers/dbErrorHandler')


// middleware for route
exports.productById = (req, res, next, id) => {
    Product.findById(id)
    .populate('category')
    .exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                error: "Product not found."
            })
        }

        // if product is found, populate the request obj
        req.product = product
        next()
    })
}


exports.read = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}


// create a new product
exports.create = (req, res) => {
    
    // make form data from frontend available
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded."
            })
        }

        // check for all fields
        const {name, description, price, category, quantity, shipping} = fields

        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All fields are required."
            })
        }

        // create a new product
        let product = new Product(fields)

        // if a file is uploaded, handle it
        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
              return res.status(400).json({
                error: "Image should be less than 1mb in size",
              });
            }
            product.photo.data = fs.readFileSync(files.photo.filepath); // change path to filepath
            product.photo.contentType = files.photo.mimetype; // change typt to mimetype
        }

        product.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }

            res.json(result)
        })
    })
}


exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({
            message: "Product deleted successfully."
        })
    })
}



exports.update = (req, res) => {
    
    // make form data from frontend available
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded."
            })
        }

        // check for all fields
        const {name, description, price, category, quantity, shipping} = fields

        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All fields are required."
            })
        }

        // create a new product
        let product = req.product
        product = _.extend(product, fields)

        // if a file is uploaded, handle it
        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
              return res.status(400).json({
                error: "Image should be less than 1mb in size",
              });
            }
            product.photo.data = fs.readFileSync(files.photo.filepath); // change path to filepath
            product.photo.contentType = files.photo.mimetype; // change typt to mimetype
        }

        product.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }

            res.json(result)
        })
    })
}


exports.list = (req, res) => {
    // if we get parameters from
    // frontend URL, we grab it
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    // DB QUERY: pulling prod. from DB 
    // based on the query parameters
    Product.find()
           .select("-photo")
           .populate('category')
           .sort([[sortBy, order]])
           .limit(limit)
           .exec((err, products) => {
                if(err) {
                    return res.status(400).json({
                        error: 'Products not found'
                    })
                }

                // sending data to DB
                res.send(products)
           })
}


exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find({_id: {$ne: req.product}, category: req.product.category})
           .limit(limit)
           .populate('category', '_id name')
           .exec((err, products) => {
                if(err) {
                    return res.status(400).json({
                        error: 'Products not found'
                    })
                }

                // sending data from DB
                res.json(products)
           })
}

exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err) {
            return res.status(400).json({
                error: 'Categories not found'
            })
        }

        // sending data from DB
        res.json(categories)
    })
}


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }

    next()
}


exports.listSearch = (req, res) => {
    // create query object to hold search and category value
    const query = {}
    // assign search value to query.name
    if(req.query.search){
        // $options: 'i' == case insensitive
        query.name = {$regex: req.query.search, $options: 'i'}
        // assign category value to query.category
        if(req.query.category && req.query.category != "All"){
            query.category = req.query.category
        }

        // find product based on query obj with 2 properties:
        // search and category
        Product.find(query, (err, products) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }

            res.json(products)
        }).select('-photo')
    }
}


exports.decreaseQuantity = (req, res, next) => {
    // map through each product in the req body
    let bulkOps = req.body.order.products.map(item => {
        // update quantity and sold values after a sale
        return {
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    })

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if(error){
            return res.status(400).json({
                error: "Could not update product"
            })
        }

        next()
    })
}

