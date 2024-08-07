const router = require('express').Router();
const userRoutes = require('./user-routes');
const mediaRoutes = require('./media-routes');
const reviewRoutes = require('./review-routes');

router.use('/users', userRoutes);
router.use('/media', mediaRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
