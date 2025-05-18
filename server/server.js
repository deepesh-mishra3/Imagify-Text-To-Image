import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

// Basic middleware
app.use(express.json()); // for parsing JSON
app.use(express.urlencoded({ extended: true })); // for form data

// Special handling for Stripe webhook
app.use('/api/payment/webhook', express.raw({type: 'application/json'}));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://imagify-image-generator.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Max-Age', '86400'); // 24 hours
        return res.status(200).json({});
    }
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send("API Working Fine");
});

// Initialize server and database
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('✅ MongoDB connected successfully');

        // Mount routes after successful DB connection
        app.use('/api/user', userRouter);
        app.use('/api/image', imageRouter);
        app.use('/api/payment', paymentRouter);

        // Start server
        app.listen(PORT, () => {
            console.log('🚀 Server is running on port:', PORT);
            console.log('🔒 CORS enabled for: https://imagify-image-generator.netlify.app');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();