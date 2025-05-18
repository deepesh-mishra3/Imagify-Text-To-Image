import express from 'express';
import { createPaymentSession, handleWebhook, getPaymentStatus } from '../controllers/paymentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Payment routes are working' });
});

router.post('/create-session', verifyToken, createPaymentSession);
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);
router.get('/status/:sessionId', verifyToken, getPaymentStatus);

export default router; 