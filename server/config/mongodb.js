import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connectionParams = {
            ssl: true,
            tls: true,
            tlsAllowInvalidCertificates: true, // Allow invalid certificates for troubleshooting
            tlsInsecure: true,
            retryWrites: true,
            w: 'majority',
            minPoolSize: 1,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 30000, // Increased timeout
            socketTimeoutMS: 45000,
            family: 4 // Force IPv4
        };

        // Log the connection string (without credentials) for debugging
        const connectionString = process.env.MONGODB_URL;
        console.log('Attempting to connect to MongoDB...');
        
        // Only log the host part of the connection string for security
        const hostPart = connectionString.split('@')[1];
        if (hostPart) {
            console.log('Connection string host:', hostPart.split('?')[0]);
        }

        // Force TLS version 1.2
        process.env.NODE_TLS_MIN_VERSION = 'TLSv1.2';
        process.env.NODE_TLS_MAX_VERSION = 'TLSv1.3';

        await mongoose.connect(process.env.MONGODB_URL, connectionParams);

        mongoose.connection.on('connected', () => {
            console.log('Database Connected Successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            // Attempt to reconnect on error
            setTimeout(() => {
                console.log('Attempting to reconnect to MongoDB...');
                mongoose.connect(process.env.MONGODB_URL, connectionParams)
                    .catch(err => console.error('Reconnection failed:', err));
            }, 5000);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            // Attempt to reconnect on disconnection
            setTimeout(() => {
                console.log('Attempting to reconnect to MongoDB...');
                mongoose.connect(process.env.MONGODB_URL, connectionParams)
                    .catch(err => console.error('Reconnection failed:', err));
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
                code: error.code,
                stack: error.stack
            });
        }
        throw error;
    }
}

export default connectDB; 