const router = require('express').Router();
const { verifyToken } = require('../../utils/auth');
const {body} = require("express-validator");
const {getUserReviews, addReview, editReview, deleteReview} = require("../../controller/review-controller");

const reviewValidationRules = [
    body('rating').isNumeric().withMessage('Rating must be a number'),
];

router.get('/', [verifyToken], getUserReviews);
router.post('/', [verifyToken, ...reviewValidationRules], addReview);
router.delete('/:id', [verifyToken], deleteReview);
router.put('/:id', [verifyToken, ...reviewValidationRules], editReview);

module.exports = router;
