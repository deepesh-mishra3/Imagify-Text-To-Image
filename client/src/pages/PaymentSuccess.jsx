import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
            navigate('/buy-credits');
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/payment/status/${sessionId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                const data = await response.json();

                if (data.status === 'complete' || data.status === 'paid') {
                    setStatus('success');
                    // Refresh user data to get updated credits
                    const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const userData = await userResponse.json();
                    setUser(userData);
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                setStatus('failed');
            }
        };

        checkPaymentStatus();
    }, [searchParams, navigate, setUser]);

    return (
        <motion.div 
            className="min-h-[80vh] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {status === 'loading' && (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Processing your payment...</h2>
                    <p>Please wait while we confirm your payment.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-green-600">Payment Successful!</h2>
                    <p className="mb-4">Your credits have been added to your account.</p>
                    <p className="mb-6">Current balance: {user?.credits || 0} credits</p>
                    <button
                        onClick={() => navigate('/generate')}
                        className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                    >
                        Start Creating
                    </button>
                </div>
            )}

            {status === 'failed' && (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-red-600">Payment Failed</h2>
                    <p className="mb-6">Something went wrong with your payment. Please try again.</p>
                    <button
                        onClick={() => navigate('/buy-credits')}
                        className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default PaymentSuccess; 