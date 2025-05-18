import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionParams = {
            ssl: true,
            tls: true,
            retryWrites: true,
            w: 'majority',
            minPoolSize: 1,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4
            authSource: 'admin'
        };

        const connectionString = process.env.MONGODB_URL;
        console.log('Attempting to connect to MongoDB...');

        // Only log the host part for security
        const hostPart = connectionString.split('@')[1];
        if (hostPart) {
            console.log('Connection string host:', hostPart.split('?')[0]);
        }

        // Set TLS/SSL version
        process.env.NODE_TLS_MIN_VERSION = 'TLSv1.2';
        process.env.NODE_TLS_MAX_VERSION = 'TLSv1.3';

        await mongoose.connect(connectionString, connectionParams);

        mongoose.connection.on('connected', () => {
            console.log('✅ Database Connected Successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
            // Log detailed error information
            if (err.name === 'MongooseServerSelectionError') {
                console.error('Server Selection Error Details:', {
                    name: err.name,
                    message: err.message,
                    reason: err.reason,
                    code: err.code
                });
            }
            setTimeout(() => {
                console.log('🔁 Attempting to reconnect to MongoDB...');
                mongoose.connect(connectionString, connectionParams)
                    .catch(err => console.error('❌ Reconnection failed:', err));
            }, 5000);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
            setTimeout(() => {
                console.log('🔁 Attempting to reconnect to MongoDB...');
                mongoose.connect(connectionString, connectionParams)
                    .catch(err => console.error('❌ Reconnection failed:', err));
            }, 5000);
        });

    } catch (error) {
        console.error('❌ Initial DB connection failed:', error);
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
};

export default connectDB;
