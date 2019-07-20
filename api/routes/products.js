const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const productController = require('./../controllers/products');

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

router.get('/', productController.getAllProducts);

router.post('/', upload.single('productImage'), productController.postAProduct);

router.get('/:productId', productController.getAProduct);

router.patch('/:productId', productController.patchAProduct);

router.delete('/:productId', productController.deleteAProduct);


module.exports = router;