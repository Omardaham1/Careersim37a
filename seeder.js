const mongoose = require('mongoose');
const {Media, User, Review} = require('./models')
const db = require('./config/connection');

const userData = [
    {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password1' // Make sure to hash passwords in a real application
    },
    {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password2'
    },
    {
        username: 'user3',
        email: 'user3@example.com',
        password: 'password3'
    },
    {
        username: 'user4',
        email: 'user4@example.com',
        password: 'password4'
    },
]


const mediaData = [
    {
        name: 'Inception',
        type: 'Movie',
        rating: 0,
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
        writers: 'Christopher Nolan',
        directors: 'Christopher Nolan',
        episodes: 1,
        language: 'English',
        runningTime: 148,
        budget: 160000000,
        boxOffice: 829895144,
    },
    {
        name: 'The Dark Knight',
        type: 'Movie',
        rating: 0,
        description: 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
        actors: 'Christian Bale, Heath Ledger',
        writers: 'Jonathan Nolan, Christopher Nolan',
        directors: 'Christopher Nolan',
        episodes: 1,
        language: 'English',
        runningTime: 152,
        budget: 185000000,
        boxOffice: 1004558444,
    },
    {
        name: 'Breaking Bad',
        type: 'Series',
        rating: 0,
        description: 'A high school chemistry teacher turned methamphetamine producer navigates the dangers of the drug trade.',
        actors: 'Bryan Cranston, Aaron Paul',
        writers: 'Vince Gilligan',
        directors: 'Various',
        episodes: 62,
        language: 'English',
        runningTime: 47,
        budget: 3000000,
        boxOffice: 0,
    },
    {
        name: 'Stranger Things',
        type: 'Series',
        rating: 0,
        description: 'A group of kids uncover a series of supernatural mysteries in their small town.',
        actors: 'Winona Ryder, David Harbour',
        writers: 'The Duffer Brothers',
        directors: 'The Duffer Brothers',
        episodes: 34,
        language: 'English',
        runningTime: 51,
        budget: 8000000,
        boxOffice: 0,
    },
    {
        name: 'Game of Thrones',
        type: 'Series',
        rating: 0,
        description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
        actors: 'Emilia Clarke, Kit Harington',
        writers: 'David Benioff, D.B. Weiss',
        directors: 'Various',
        episodes: 73,
        language: 'English',
        runningTime: 57,
        budget: 15000000,
        boxOffice: 0,
    },
    {
        name: 'The Matrix',
        type: 'Movie',
        rating: 0,
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        actors: 'Keanu Reeves, Laurence Fishburne',
        writers: 'Lana Wachowski, Lilly Wachowski',
        directors: 'Lana Wachowski, Lilly Wachowski',
        episodes: 1,
        language: 'English',
        runningTime: 136,
        budget: 63000000,
        boxOffice: 465300000,
    },
    {
        name: 'The Office',
        type: 'Series',
        rating: 0,
        description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
        actors: 'Steve Carell, Rainn Wilson',
        writers: 'Greg Daniels',
        directors: 'Various',
        episodes: 201,
        language: 'English',
        runningTime: 22,
        budget: 2000000,
        boxOffice: 0,
    },
    {
        name: 'Friends',
        type: 'Series',
        rating: 0,
        description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.',
        actors: 'Jennifer Aniston, Courteney Cox',
        writers: 'David Crane, Marta Kauffman',
        directors: 'Various',
        episodes: 236,
        language: 'English',
        runningTime: 22,
        budget: 1000000,
        boxOffice: 0,
    },
    {
        name: 'Pulp Fiction',
        type: 'Movie',
        rating: 0,
        description: 'The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption.',
        actors: 'John Travolta, Uma Thurman',
        writers: 'Quentin Tarantino, Roger Avary',
        directors: 'Quentin Tarantino',
        episodes: 1,
        language: 'English',
        runningTime: 154,
        budget: 8000000,
        boxOffice: 213928762,
    },
    {
        name: 'The Shawshank Redemption',
        type: 'Movie',
        rating: 0,
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        actors: 'Tim Robbins, Morgan Freeman',
        writers: 'Stephen King, Frank Darabont',
        directors: 'Frank Darabont',
        episodes: 1,
        language: 'English',
        runningTime: 142,
        budget: 25000000,
        boxOffice: 28341469,
    },
    {
        name: 'Interstellar',
        type: 'Movie',
        rating: 0,
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        actors: 'Matthew McConaughey, Anne Hathaway',
        writers: 'Jonathan Nolan, Christopher Nolan',
        directors: 'Christopher Nolan',
        episodes: 1,
        language: 'English',
        runningTime: 169,
        budget: 165000000,
        boxOffice: 677471339,
    },
];

db.once('open', async () => {
    try {
        await User.deleteMany({});
        await Media.deleteMany({});
        await Review.deleteMany({});

        const users = await User.insertMany(userData);
        const userIds = users.map(user => user._id);

        const media = await Media.insertMany(mediaData);
        const mediaIds = media.map(m => m._id);


        const reviewData = [
            {
                user: userIds[0], // Reference to user1
                media: mediaIds[0], // Reference to Inception
                rating: 5,
                comment: 'Amazing movie! Must watch.'
            },
            {
                user: userIds[1], // Reference to user2
                media: mediaIds[0], // Reference to Inception
                rating: 4,
                comment: 'Great movie, but a bit confusing at times.'
            },
            {
                user: userIds[2], // Reference to user3
                media: mediaIds[1], // Reference to The Dark Knight
                rating: 5,
                comment: 'Best Batman movie ever!'
            },
            {
                user: userIds[3], // Reference to user4
                media: mediaIds[1], // Reference to The Dark Knight
                rating: 4.5,
                comment: 'Heath Ledger was amazing as the Joker.'
            },
            {
                user: userIds[0], // Reference to user1
                media: mediaIds[2], // Reference to Breaking Bad
                rating: 5,
                comment: 'Best TV show ever.'
            },
            {
                user: userIds[1], // Reference to user2
                media: mediaIds[2], // Reference to Breaking Bad
                rating: 4.8,
                comment: 'Bryan Cranston is phenomenal.'
            },
            {
                user: userIds[2], // Reference to user3
                media: mediaIds[3], // Reference to Stranger Things
                rating: 4.5,
                comment: 'Love the 80s vibe.'
            },
            {
                user: userIds[3], // Reference to user4
                media: mediaIds[3], // Reference to Stranger Things
                rating: 4.7,
                comment: 'Great show, can\'t wait for the next season.'
            },
            {
                user: userIds[0], // Reference to user1
                media: mediaIds[4], // Reference to Game of Thrones
                rating: 4,
                comment: 'Great show until the last season.'
            },
            {
                user: userIds[1], // Reference to user2
                media: mediaIds[4], // Reference to Game of Thrones
                rating: 4.2,
                comment: 'Loved the dragons and battles.'
            },
            {
                user: userIds[2], // Reference to user3
                media: mediaIds[5], // Reference to The Matrix
                rating: 5,
                comment: 'A sci-fi masterpiece.'
            },
            {
                user: userIds[3], // Reference to user4
                media: mediaIds[5], // Reference to The Matrix
                rating: 4.8,
                comment: 'Keanu Reeves was fantastic.'
            },
            {
                user: userIds[0], // Reference to user1
                media: mediaIds[6], // Reference to The Office
                rating: 5,
                comment: 'Hilarious show, never gets old.'
            },
            {
                user: userIds[1], // Reference to user2
                media: mediaIds[6], // Reference to The Office
                rating: 4.7,
                comment: 'Great cast, very funny.'
            },
            {
                user: userIds[2], // Reference to user3
                media: mediaIds[7], // Reference to Friends
                rating: 5,
                comment: 'Classic sitcom, love it.'
            },
            {
                user: userIds[3], // Reference to user4
                media: mediaIds[7], // Reference to Friends
                rating: 4.9,
                comment: 'Great show, very entertaining.'
            },
            {
                user: userIds[0], // Reference to user1
                media: mediaIds[8], // Reference to Pulp Fiction
                rating: 5,
                comment: 'A masterpiece of modern cinema.'
            },
            {
                user: userIds[1], // Reference to user2
                media: mediaIds[8], // Reference to Pulp Fiction
                rating: 4.8,
                comment: 'Tarantino at his best.'
            },
            {
                user: userIds[2], // Reference to user3
                media: mediaIds[9], // Reference to The Shawshank Redemption
                rating: 5,
                comment: 'Inspirational and moving.'
            },
            {
                user: userIds[3], // Reference to user4
                media: mediaIds[9], // Reference to The Shawshank Redemption
                rating: 4.9,
                comment: 'A timeless classic.'
            },
            {
                user: userIds[0], // Reference to user1
                media: mediaIds[10], // Reference to Interstellar
                rating: 5,
                comment: 'Mind-blowing sci-fi.'
            },
            {
                user: userIds[1], // Reference to user2
                media: mediaIds[10], // Reference to Interstellar
                rating: 4.8,
                comment: 'Amazing visuals and story.'
            },
        ];

        // Insert reviews
        await Review.insertMany(reviewData);


        console.log('Data seeded successfully');
    } catch (error) {
        console.error('Error seeding media data:', error);
    } finally {
        mongoose.connection.close();
    }
});
