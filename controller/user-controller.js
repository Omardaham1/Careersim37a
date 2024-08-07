const {User} = require('../models');
const {createToken} = require('../utils/auth');
const {validationResult, body} = require("express-validator");

// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
exports.createUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    User.create(req.body)
        .then(newUser => {
            const token = createToken(newUser.username, newUser.email, newUser._id);
            const returnUser = {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
            res.status(200).send({user: returnUser, accessToken: token});
        })
        .catch(err => {
            res.status(500).send({error: err.message});
        });

}

exports.loginUser = (req, res) => {
    const userCreationValidationRules = [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').notEmpty().withMessage('Email is required'),
        body('password').isNumeric().withMessage('Password is required'),
    ];

    User.findOne({email: req.body.email})
        .then(async foundUser => {
            const correctPw = foundUser.isCorrectPassword(req.body.password);
            if (!correctPw) {
                return res.status(400).send({error: 'Wrong password!'});
            }
            const token = createToken(foundUser.username, foundUser.email, foundUser._id);

            const returnUser = {
                _id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email
            }
            res.status(200).send({user: returnUser, accessToken: token});
        })
        .catch(err => {
            res.status(500).send({error: err.message});
        });
};

