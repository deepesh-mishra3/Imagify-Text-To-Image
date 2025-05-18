import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify';
function Login() {

    // signup or login
    const [state, setstate] = useState('Login');

    // Login from khula hua hai ya nahi .. uss information ko set karne k liye from the context Api  
    const { setShowLogin, backendUrl, setUser, setToken } = useContext(AppContext);

    // name,email and password 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // onsubmitHandler function
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            console.log('Backend URL:', backendUrl); // Debug log
            const endpoint = state === 'Login' ? '/api/user/login' : '/api/user/register';
            const payload = state === 'Login' ? { email, password } : { name, email, password };
            
            console.log('Making request to:', `${backendUrl}${endpoint}`); // Debug log
            const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);
            
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                setShowLogin(false);
                toast.success(state === 'Login' ? 'Login successful!' : 'Account created successfully!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Request error:', error); // Debug log
            toast.error(error.response?.data?.message || error.message || 'An error occurred');
        }
    }

    // we have to prevent the scrolling functionality on opening of our Login from 
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])

    return (
        <div className='fixed top-0 left-0 bottom-0 right-0 z-10 backdrop:blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'
                initial={{ opacity: 0.2, y: 100 }}
                transition={{ duration: 1 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium '>{state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>
                {/* full name div => SignUp k time par hi dikhegaa  */}
                {state !== 'Login' &&
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.profile_icon} width={25} alt="Profile" />
                        <input 
                            onChange={e => setName(e.target.value)} 
                            value={name} 
                            type="text" 
                            name="fullname" 
                            placeholder='Full Name' 
                            required 
                            id="signup-name" 
                            className='outline-none text-sm w-full' 
                        />
                    </div>
                }
                {/* email field here */}
                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.email_icon} alt="Email" />
                    <input 
                        onChange={e => setEmail(e.target.value)} 
                        value={email} 
                        type="email" 
                        name="email" 
                        placeholder='Email id' 
                        required 
                        id="login-email" 
                        className='outline-none text-sm w-full' 
                    />
                </div>
                {/* password field is here */}
                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.lock_icon} alt="Password" />
                    <input 
                        onChange={e => setPassword(e.target.value)} 
                        value={password} 
                        type="password" 
                        name="password" 
                        placeholder='Password' 
                        required 
                        id="login-password" 
                        className='outline-none text-sm w-full' 
                    />
                </div>

                <p className='text-sm text-blue-600 w-full my-4 cursor-pointer'>Forgot Password ? </p>

                <button type="submit" className='bg-blue-600 w-full text-white py-2 rounded-full hover:bg-blue-700'>
                    {state === 'Login' ? 'Login' : 'Create Account'}
                </button>
                
                {state === 'Login' ? (
                    <p className='mt-5 text-center'>
                        Don't have an account? <span className='text-blue-600 hover:text-blue-700 cursor-pointer' onClick={() => setstate('Sign Up')}>Sign Up</span>
                    </p>
                ) : (
                    <p className='mt-5 text-center'>
                        Already have an account? <span className='text-blue-600 hover:text-blue-700 cursor-pointer' onClick={() => setstate('Login')}>Login</span>
                    </p>
                )}
                {/* CLOSE ICON for the closing of the form */}
                <img 
                    src={assets.cross_icon} 
                    alt="Close" 
                    className='absolute top-5 right-5 cursor-pointer' 
                    onClick={() => setShowLogin(false)} 
                />
            </motion.form>
        </div>
    )
}

export default Login
