const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');

exports.newUserSignup = (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(doc => {
            if (doc.length >= 1) {
                return res.status(409).json({
                    message: `Unable to process ${req.body.email} as it is already present`
                })
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error) {
                        return res.status(500).json({ error });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then((response) => {
                                if (!response) {
                                    return res.status(404).json({
                                        message: 'Unable to add user'
                                    })
                                }
                                res.status(201).json({
                                    message: 'User added successfully',
                                    response
                                })
                            })
                            .catch((error) => {
                                res.status(500).json({ error });
                            })
                    }
                })
            }
        })
}

exports.loginAUser = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(response => {
            console.log("process.env.JWT_KEY", process.env.JWT_KEY);
            if (response) {
                bcrypt.compare(req.body.password, response.password, (error, result) => {
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: response.email,
                                userId: response._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: '1h'
                            });
                        return res.status(200).json({
                            message: 'Auth Successful! User Found. ',
                            token
                        })
                    } else {
                        return res.status(404).json({
                            message: 'Auth Failed! User Not found'
                        })
                    }
                })
            } else {
                return res.status(404).json({
                    message: 'Auth Failed! User Not found'
                })
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        })
}

exports.getAllUsers = (req, res, next) => {
    User.find().select().exec().then(response => {
        res.status(200).json({
            response
        })
    })
}

exports.deleteAUser = (req, res, next) => {
    User.findByIdAndRemove(req.params.userId).exec().then((response) => {
        console.log("response", response);
        if (response) {
            res.status(200).json({
                response,
                message: 'User removed'
            })
        } else {
            res.status(404).json({
                response,
                message: 'User cannot be removed, as it may not present or already deleted'
            })
        }
    }).catch(error => {
        res.status(500).json({
            error
        })
    })
}