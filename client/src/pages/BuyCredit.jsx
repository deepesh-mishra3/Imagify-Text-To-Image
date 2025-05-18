import React, { useContext, useState } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const BuyCredit = () => {
    const { user, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePurchase = async (planId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            console.log('Making request to:', `${backendUrl}/api/payment/create-session`);
            const response = await fetch(`${backendUrl}/api/payment/create-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ planId })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server response:', response.status, errorData);
                throw new Error(errorData || 'Failed to create payment session');
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className='min-h-[80vh] text-center pt-14 mb-10'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
            <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan </h1>
            {/* plans display */}
            <div className='flex flex-wrap justify-center gap-6 text-left'>
                {plans.map((item, index) => (
                    <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
                        <img width={40} src={assets.logo_icon} alt="" />
                        <p className='mt-3 mb-1 font-semibold'> {item.id}</p>
                        <p className='text-sm '>{item.desc}</p>
                        <p className='mt-6'><span className='text-3xl font-medium'>${item.price}</span>/{item.credits} credits</p>
                        {/* user logged-in : purchase while user not logged-in : get started */}
                        <button 
                            className='w-full bg-gray-800 text-white mt-8 text-sm  rounded-md py-2.5 min-w-52'
                            onClick={() => handlePurchase(item.id)}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : user ? 'Purchase' : 'Get Started'}
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default BuyCredit
