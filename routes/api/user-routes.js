const {createUser, loginUser} = require("../../controller/user-controller");
const {body} = require("express-validator");
const router = require('express').Router();

const userCreationValidationRules = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const userLoginValidationRules = [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

router.post('/', ...userCreationValidationRules, createUser);
router.post('/login', ...userLoginValidationRules, loginUser);

module.exports = router;
