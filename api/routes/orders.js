const express = require('express');
const checkAuth = require('./../authentication-middleware/check-auth');
const ordersController = require('./../controllers/orders');

const router = express.Router();

router.get('/', checkAuth, ordersController.getAllOrders);

router.post('/', ordersController.postAOrder);


router.get('/:orderId', ordersController.getAOrder);


router.delete('/:orderId', ordersController.deleteAOrder);

router.patch('/:orderId', ordersController.patchAnOrder)



module.exports = router;