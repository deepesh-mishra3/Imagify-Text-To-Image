import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

// Configure Express middleware
app.use(express.json()); // for parsing JSON
app.use(express.urlencoded({ extended: true })); // for form data

// Special handling for Stripe webhook
app.use('/api/payment/webhook', express.raw({type: 'application/json'}));

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://imagify-text-to-image.netlify.app', 'https://imagify-text-to-image.onrender.com']
    : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Health check endpoint
app.get('/', (req, res) => {
    res.send("API Working Fine");
});

// Initialize server and database
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('MongoDB connected successfully');

        // Mount routes after successful DB connection
        app.use('/api/user', userRouter);
        app.use('/api/image', imageRouter);
        app.use('/api/payment', paymentRouter);

        // Start server
        app.listen(PORT, () => {
            console.log('Server is running on port: ' + PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();