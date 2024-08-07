const { Schema, model } = require('mongoose');

const mediaSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: '',
        },
        rating: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: '',
        },
        actors: {
            type: String,
            default: 0,
        },
        writers: {
            type: String,
            default: 0,
        },
        directors: {
            type: String,
            default: 0,
        },
        episodes: {
            type: Number,
            default: 1,
        },
        language: {
            type: String,
            default: 0,
        },
        runningTime: {
            type: Number,
            default: 0,
        },
        budget: {
            type: Number,
            default: 0,
        },
        boxOffice: {
            type: Number,
            default: 0,
        },
    }
);

const Media = model('Media', mediaSchema);

module.exports = Media;
