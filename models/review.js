const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
    rating: { type: Number, required: true },
    comment: String,
});

reviewSchema.index({ user: 1, media: 1 }, { unique: true });

const Review = model('Review', reviewSchema);

module.exports = Review;
