const app = require('./app');
const connectDB = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost/mediareviewer';
connectDB(dbUri)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
