const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./setup'); // Ensure the path is correct
const {Media, Review, User} = require("../models")
const { createToken } = require('../utils/auth');

describe('Review Endpoints', () => {
    let token;
    let userId;
    let mediaId;
    let reviewId;
    let expect;

    before(async () => {
        // Dynamically import chai
        const chai = await import('chai');
        expect = chai.expect;
    });

    beforeEach(async () => {
        await Media.deleteMany({});
        await User.deleteMany({});
        await Review.deleteMany({});

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password', // Assume passwords are hashed in the real application
        });
        await user.save();
        userId = user._id;
        token = createToken(user.username, user.email, userId);

        const media = new Media({
            name: 'Inception',
            type: 'Movie',
            rating: 4.8,
            description: 'A thief who steals corporate secrets...',
            actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
            writers: 'Christopher Nolan',
            directors: 'Christopher Nolan',
            episodes: 1,
            language: 'English',
            runningTime: 148,
            budget: 160000000,
            boxOffice: 829895144,
        });
        await media.save();
        mediaId = media._id.toString();
    });

    describe('GET /api/reviews', () => {
        it('should return all reviews for the user', async () => {
            const reviewData = {
                user: userId,
                media: mediaId,
                rating: 5,
                comment: 'Amazing movie! Must watch.',
            };

            const review = new Review(reviewData);
            await review.save();

            const res = await request(app)
                .get('/api/reviews')
                .set('access-token', token);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('comment', 'Amazing movie! Must watch.');
        });
    });

    describe('POST /api/reviews', () => {
        it('should create a new review', async () => {
            const reviewData = {
                mediaId: mediaId,
                rating: 5,
                comment: 'Amazing movie! Must watch.',
            };

            const res = await request(app)
                .post('/api/reviews')
                .set('access-token', token)
                .send(reviewData);

            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('comment', 'Amazing movie! Must watch.');

            reviewId = res.body._id;
        });

        it('should not create a review with missing required fields', async () => {
            const reviewData = {
                media: mediaId,
            };

            const res = await request(app)
                .post('/api/reviews')
                .set('access-token', token)
                .send(reviewData);

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('errors');
        });
    });

    describe('PUT /api/reviews/:id', () => {
        beforeEach(async () => {
            const reviewData = {
                user: userId,
                media: mediaId,
                rating: 5,
                comment: 'Amazing movie! Must watch.',
            };

            const review = new Review(reviewData);
            await review.save();
            reviewId = review._id;
        });

        it('should update an existing review', async () => {
            const updateData = {
                rating: 4,
                comment: 'Great movie, but a bit confusing at times.',
            };

            const res = await request(app)
                .put(`/api/reviews/${reviewId}`)
                .set('access-token', token)
                .send(updateData);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('comment', 'Great movie, but a bit confusing at times.');
            expect(res.body).to.have.property('rating', 4);
        });

        it('should return 404 if review not found', async () => {
            const nonExistingId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .put(`/api/reviews/${nonExistingId}`)
                .set('access-token', token)
                .send({
                    rating: 4,
                    comment: 'Great movie, but a bit confusing at times.',
                });

            expect(res.status).to.equal(404);
        });
    });

    describe('DELETE /api/reviews/:id', () => {
        beforeEach(async () => {
            const reviewData = {
                user: userId,
                media: mediaId,
                rating: 5,
                comment: 'Amazing movie! Must watch.',
            };

            const review = new Review(reviewData);
            await review.save();
            reviewId = review._id;
        });

        it('should delete an existing review', async () => {
            const res = await request(app)
                .delete(`/api/reviews/${reviewId}`)
                .set('access-token', token);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Review deleted successfully');

            const deletedReview = await Review.findById(reviewId);
            expect(deletedReview).to.be.null;
        });

        it('should return 404 if review not found', async () => {
            const nonExistingId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .delete(`/api/reviews/${nonExistingId}`)
                .set('access-token', token);

            expect(res.status).to.equal(404);
        });
    });
});
