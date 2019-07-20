const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const userController = require('./../controllers/users');


router.post('/signup', userController.newUserSignup);

router.post('/login', userController.loginAUser);

router.get('/', userController.getAllUsers);

router.delete('/:userId', userController.deleteAUser);

module.exports = router;

