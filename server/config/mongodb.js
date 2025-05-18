import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connectionParams = {
            ssl: true,
            tls: true,
            tlsInsecure: true, // Required for some MongoDB Atlas connections
            retryWrites: true,
            w: 'majority',
            minPoolSize: 1,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        // Log the connection string (without credentials) for debugging
        const connectionString = process.env.MONGODB_URL;
        console.log('Attempting to connect to MongoDB...');
        
        // Only log the host part of the connection string for security
        const hostPart = connectionString.split('@')[1];
        if (hostPart) {
            console.log('Connection string host:', hostPart.split('?')[0]);
        }

        await mongoose.connect(process.env.MONGODB_URL, connectionParams);

        mongoose.connection.on('connected', () => {
            console.log('Database Connected Successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            // Attempt to reconnect on error
            setTimeout(() => {
                console.log('Attempting to reconnect to MongoDB...');
                mongoose.connect(process.env.MONGODB_URL, connectionParams);
            }, 5000);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            // Attempt to reconnect on disconnection
            setTimeout(() => {
                console.log('Attempting to reconnect to MongoDB...');
                mongoose.connect(process.env.MONGODB_URL, connectionParams);
            }, 5000);
        });

    } catch (error) {
        console.error('Database connection failed:', error);
        // Log detailed error information
        if (error.name === 'MongooseServerSelectionError') {
            console.error('Server Selection Error Details:', {
                name: error.name,
                message: error.message,
                reason: error.reason,
                code: error.code
            });
        }
        throw error;
    }
}

export default connectDB; 