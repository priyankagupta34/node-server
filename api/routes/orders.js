const express = require('express');
const mongoose = require('mongoose');
const Order = require('./../models/order');
const Product = require('./../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate('product','name')
        .exec()
        .then((results) => {
            const data = results.map(result => {
                return {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        method: 'GET',
                        url: `https://localhost:700/${result._id}`
                    }
                }
            })
            res.status(200).json({
                response: data
            })
        })
})

router.post('/', (req, res, next) => {

    Product.findById(req.body.product).exec()
        .then((result) => {
            if(!result){
                return res.status(404).json({
                    message: 'Product not found, so this order cannot be created'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.product,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => {
            if (result) {
                res.status(201).json({ response: result });
            }
        })
        .catch((error) => res.status(500)
            .json({
                error
            })
        )

})


router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).exec()
        .then(result => {
            res.status(200).json({ response: result })
        })
        .catch(error => res.status(500).json({ error }))
})


router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findByIdAndRemove(id).exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    response: result
                })
            } else {
                res.status(400).json({
                    message: "Bad request to delete",
                    error
                })
            }
        })
})

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    const updatedDate = {};
    for (const a of req.body) {
        updatedDate[a.key] = a.value
    }
    Order.findByIdAndUpdate(id, { $set: updatedDate }).exec()
        .then(result => {
            console.log("result", result);
            if (result) {
                res.status(200).json({
                    response: result
                })
            } else {
                res.status(400).json({
                    message: 'Could not update the order successfully',
                    response: result
                })
            }
        })
        .catch((error) => res.status(500).json({
            error,
            message:'Something went wrong and order could not be updated succesfully'
        }))
})



module.exports = router;