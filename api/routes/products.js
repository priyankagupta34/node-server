const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Please select JPEG/JPG/PNG image file types'), false);
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter
});


const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage')  // Here we can initially give what things we need to see
        .exec()
        .then((datas) => {
            if (datas) {
                const response = datas.map(data => {
                    return {
                        name: data.name,
                        price: data.price,
                        _id: data._id,
                        productImage:data.productImage,
                        request: {
                            type: 'GET',
                            url: `http://localhost:7000/products/${data._id}`
                        }
                    }
                })
                res.status(200).json({
                    message: 'Fetched all data successfuly',
                    response,
                    length: datas.length
                })
            } else {
                res.status(400).json({
                    message: 'Bad Request for fetching all products',
                    response: datas
                })
            }
        })
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then((result) => {
        res.status(201).json({
            message: 'Handling POST to /products',
            created: result
        })
    })
        .catch((err) => {
            res.status(500).json({
                message: 'Error while creating the product',
                err
            })
        });

});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
        .then((resonse) => {
            if (resonse) {
                res.status(200).json({
                    message: 'Product fetched successfully',
                    response: resonse
                });
            } else {
                res.status(400).json({
                    message: 'No Valid entry',
                    response: resonse
                });
            }
        })
        .catch((err) => {
            console.log("oops cannot find the product", err);
            res.status(500).json({
                err,
                message: 'Oopsie!! error'
            });
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateData = {};
    for (const ops of req.body) {
        console.log("ops", ops)
        updateData[ops.key] = ops.value
    }
    Product.findByIdAndUpdate(id, { $set: updateData }).exec()
        .then((response) => {
            res.status(200).json({
                message: `Updated successfully ${id}`,
                response
            })
        })
        .catch((error) => {
            res.status(400).json({
                message: `Could not update ${id}`,
                error
            })
        })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndRemove(id).exec()
        .then((response) => {
            if (response) {
                res.status(200).json({
                    message: `Product delete successfully ${id}`,
                    response
                })
            } else {
                res.status(400).json({
                    message: `Deleting Product ${id} is a bad request,
                     may be this object is already deleted or never created`,
                    response
                })
            }
        })
        .catch((err) => {
            res.status((400)).json({
                message: `Error occured while deleting ${id}`,
                error: err
            })
        })
});


module.exports = router;