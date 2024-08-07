const mongoose = require('mongoose');

let isConnected;

const connectDB = async (uri) => {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        mongoose.connection.once('open', () => {
            console.log('MongoDB connected');
            isConnected = true;
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err.message);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
