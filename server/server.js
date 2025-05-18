import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

// app.use(express.json());
app.use(express.json()); // for parsing JSON
app.use(express.urlencoded({ extended: true })); // for form data

// Special handling for Stripe webhook
app.use('/api/payment/webhook', express.raw({type: 'application/json'}));

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-netlify-app.netlify.app'] // Replace with your Netlify domain
    : 'http://localhost:5173', // Vite's default development port
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// connecting with the database 
await connectDB();

// http://localhost:4000/api/user/register
// http://localhost:4000/api/user/login
app.use('/api/user', userRouter); // mounting waala concept 
app.use('/api/image', imageRouter);
app.use('/api/payment', paymentRouter);

app.get('/', (req, res) => {
    res.send("API Working Fine");
})

app.listen(PORT, () => {
    console.log('server is running on port : ' + PORT);
})