import Stripe from 'stripe';
import User from '../models/userModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const createPaymentSession = async (req, res) => {
    try {
        console.log('Creating payment session...');
        console.log('Request body:', req.body);
        console.log('User:', req.user);

        const { planId } = req.body;
        const userId = req.user.id;

        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Stripe secret key is not configured');
            return res.status(500).json({ message: 'Payment service not configured' });
        }

        console.log('Stripe key configured, creating session...');

        // Get plan details from your plans array
        const plans = {
            'Basic': { price: 10, credits: 100 },
            'Advanced': { price: 50, credits: 500 },
            'Business': { price: 250, credits: 5000 }
        };

        const plan = plans[planId];
        if (!plan) {
            console.error('Invalid plan:', planId);
            return res.status(400).json({ message: 'Invalid plan selected' });
        }

        console.log('Creating Stripe session for plan:', planId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${planId} Credits Package`,
                            description: `${plan.credits} AI Image Generation Credits`,
                        },
                        unit_amount: plan.price * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${FRONTEND_URL}/buy`,
            metadata: {
                userId,
                credits: plan.credits,
                planId
            }
        });

        console.log('Stripe session created:', session.id);

        if (!session || !session.url) {
            throw new Error('Failed to create Stripe session');
        }

        console.log('Returning session URL to client');
        res.json({ url: session.url });
    } catch (error) {
        console.error('Payment session creation error:', error);
        res.status(500).json({ 
            message: error.message || 'Error creating payment session',
            details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        });
    }
};

export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        try {
            const user = await User.findById(session.metadata.userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Add credits to user's account
            const creditsToAdd = parseInt(session.metadata.credits);
            user.credits += creditsToAdd;
            await user.save();

            console.log(`Added ${creditsToAdd} credits to user ${user._id}`);
        } catch (error) {
            console.error('Error processing payment success:', error);
            return res.status(500).json({ error: 'Error processing payment' });
        }
    }

    res.json({ received: true });
};

export const getPaymentStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        res.json({
            status: session.payment_status,
            customer_email: session.customer_details?.email
        });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ message: 'Error fetching payment status' });
    }
}; 