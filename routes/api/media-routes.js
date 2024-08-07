const router = require('express').Router();
const { verifyToken } = require('../../utils/auth');
const {getAllMedia, getMediaById, addMedia, editMedia, deleteMedia} = require("../../controller/media-controller");
const {body} = require("express-validator");

const mediaValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('score').isNumeric().withMessage('Score must be a number'),
    body('description').notEmpty().withMessage('Description is required')
];

router.get('/', getAllMedia);
router.get('/:id',getMediaById);
router.post('/', [verifyToken, ...mediaValidationRules],addMedia);
router.put('/:id', [verifyToken, ...mediaValidationRules], editMedia);
router.delete('/:id', [verifyToken], deleteMedia);

module.exports = router;
