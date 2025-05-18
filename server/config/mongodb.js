import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connectionParams = {
            ssl: true,
            tls: true,
            tlsAllowInvalidCertificates: false,
            retryWrites: true,
            w: 'majority'
        };

        // Log the connection string (without credentials) for debugging
        const connectionString = process.env.MONGODB_URL;
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string format:', connectionString.split('@')[1]);

        await mongoose.connect(process.env.MONGODB_URL, connectionParams);

        mongoose.connection.on('connected', () => {
            console.log('Database Connected Successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

export default connectDB; 