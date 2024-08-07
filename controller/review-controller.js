const {Review, Media} = require('../models');
const {validationResult} = require("express-validator");

exports.getUserReviews = (req, res) => {
    const userId = req.userId;

    Review.find({user: userId}).populate('media')
        .then(reviews => {
            if (!reviews) {
                res.status(500).send([]);
            }
            res.status(200).send(reviews);
        })
        .catch(err => {
            res.status(500).send({error: err.message});
        });
}

exports.addReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    const { mediaId, rating, comment } = req.body;
    const userId = req.userId;

    try {
        const newReview = new Review({
            user: userId,
            media: mediaId,
            rating,
            comment,
        });

        await newReview.save();

        const reviews = await Review.find({ media: mediaId });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Media.findByIdAndUpdate(mediaId, { rating: averageRating });

        res.status(201).send(newReview);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return res.status(404).send({ message: 'Review not found' });
        }

        const reviews = await Review.find({ media: review.media });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        await Media.findByIdAndUpdate(review.media, { rating: averageRating });

        res.status(200).send({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.editReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).send({ message: 'Review not found' });
        }

        const oldRating = review.rating;

        // Update the review
        review.rating = rating;
        review.comment = comment;
        await review.save();

        // If the rating has changed, recalculate the media's average rating
        if (oldRating !== rating) {
            const reviews = await Review.find({ media: review.media });
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;

            // Update the media's rating
            await Media.findByIdAndUpdate(review.media, { rating: averageRating });
        }

        res.status(200).send(review);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
