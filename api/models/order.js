const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _Id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 2 }
})

module.exports = mongoose.model('Order', orderSchema);