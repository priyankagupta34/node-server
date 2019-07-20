const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://admin:admin@node-shop-dkclu.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true },
    (err, db) => {
        if (!err) {
            console.log("MongoDB is up")
        } else {
            console.log("mongodb errored")
        }
    }
)

mongoose.Promise = global.Promise;


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (res.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})


app.use(morgan('dev'));
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/uploads',express.static('uploads'));

app.use((req, res, next) => {
    console.log("first thing on call");
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    console.log("secnd thing on call");
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;