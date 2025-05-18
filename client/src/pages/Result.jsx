import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
//      actual text to image mai convert karne waala page 
const Result = () => {
    const [image, setImage] = useState(assets.sample_img_1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState(''); // store what has been type in the input field 
    const { generateImage, user } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        // Check if user has credits
        if (user?.credits <= 0) {
            toast.error('You have no credits left. Please purchase more credits to continue.');
            navigate('/buy');
            return;
        }

        setLoading(true);
        if (input) {
            const generatedImage = await generateImage(input);
            if (generatedImage) {
                setImage(generatedImage);
                setIsImageLoaded(true);
            }
        }
        setLoading(false);
    }
    return (
        <motion.form onSubmit={onSubmitHandler} className='flex flex-col justify-center items-center min-h-[90vh]'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div>
                <div className='relative'>
                    <img src={image} alt="" className='max-w-sm rounded' />
                    {/* horizontal blue line coming during loading only */}
                    <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}></span>

                </div>
                {/* if loading then, show this p tag */}
                <p className={!loading ? 'hidden' : ''}>Loading ...</p>

            </div>
            {/*  when the image is not loaded then only display this div */}
            {!isImageLoaded &&
                <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full  justify-center items-center'>
                    <input onChange={(e) => { setInput(e.target.value) }} value={input} type="text" name="" id="" placeholder='What do you want to generate?' className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color' />
                    <button type="submit" className='bg-zinc-900 px-10 sm:px-17 py-3 rounded-full text-white' disabled={loading}>
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            }
            {/*  when the immage is loaded then, only show this div */}
            {isImageLoaded &&
                <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
                    <p onClick={() => { setIsImageLoaded(false) }} className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
                    <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer '>Download</a>
                </div>
            }

            {/* Display current credits */}
            <div className="mt-4 text-sm text-gray-600">
                Credits remaining: {user?.credits || 0}
            </div>
        </motion.form>
    )
}

export default Result
