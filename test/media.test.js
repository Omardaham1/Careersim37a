const {Media, Review, User} = require("../models")
const request = require('supertest');
const app = require('./setup');


describe('Media Endpoints', () => {
    let expect;

    before(async () => {
        const chai = await import('chai');
        expect = chai.expect;
    });

    beforeEach(async () => {
        await Media.deleteMany({});
        await User.deleteMany({});
        await Review.deleteMany({});
    });

    describe('GET /api/media', () => {
        beforeEach(async () => {
            const mediaData = [
                {
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
                },
            ];

            const media = await Media.insertMany(mediaData);

            const userData = [
                {
                    username: 'user1',
                    email: 'user1@example.com',
                    password: 'password1',
                },
            ];

            const users = await User.insertMany(userData);

            const reviewData = [
                {
                    user: users[0]._id,
                    media: media[0]._id,
                    rating: 5,
                    comment: 'Amazing movie! Must watch.',
                },
            ];

            await Review.insertMany(reviewData);
        });

        it('should return all media with reviews', async () => {
            const res = await request(app).get('/api/media');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Inception');
            expect(res.body[0]).to.have.property('reviews');
            expect(res.body[0].reviews).to.be.an('array');
            expect(res.body[0].reviews.length).to.equal(1);
            expect(res.body[0].reviews[0]).to.have.property('comment', 'Amazing movie! Must watch.');
        });
    });

    describe('GET /api/media/:id', () => {
        let mediaId;

        beforeEach(async () => {
            const mediaData = [
                {
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
                },
            ];

            const media = await Media.insertMany(mediaData);
            mediaId = media[0]._id;

            const userData = [
                {
                    username: 'user1',
                    email: 'user1@example.com',
                    password: 'password1',
                },
            ];

            const users = await User.insertMany(userData);

            const reviewData = [
                {
                    user: users[0]._id,
                    media: media[0]._id,
                    rating: 5,
                    comment: 'Amazing movie! Must watch.',
                },
            ];

            await Review.insertMany(reviewData);
        });

        it('should return media by ID with reviews', async () => {
            const res = await request(app).get(`/api/media/${mediaId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name', 'Inception');
            expect(res.body).to.have.property('reviews');
            expect(res.body.reviews).to.be.an('array');
            expect(res.body.reviews.length).to.equal(1);
            expect(res.body.reviews[0]).to.have.property('comment', 'Amazing movie! Must watch.');
        });
    });
});
