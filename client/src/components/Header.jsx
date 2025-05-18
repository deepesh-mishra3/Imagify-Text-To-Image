import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
// the banner section in the home page

// for adding the animation we had usen the framer motion 
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom';

function Header() {
    // is user logged-in or not 
    const {user} = useContext(AppContext);
    // to navigate on the other pages 
    const navigate = useNavigate();
    // if the user is not logged in then, if he click on the generate images button then, he has to firstly login .. so we need to open the login form in that case 
    // for that we have to change the showLoginState to true 
    const {setShowLogin} = useContext(AppContext);
    // generate images button handler 
    function onClickHandler(){
        if(user){
            navigate('/result')
        }else {
            setShowLogin(true);
        }
    }

    return (

        // whileInView is a prop in Framer Motion used to trigger animation when the element comes into the viewport (i.e., when it becomes visible while scrolling).

        /*✅ viewport={{ once: true }} in Framer Motion
                It means:

                👉 Animate only the first time the element enters the viewport.
                
                After that, no animation even if you scroll away and come back. */
        
        <motion.div className='flex flex-col justify-center items-center text-center my-20'

            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <motion.div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500'
            
            initial={{ opacity: 0, y: -20 }}
            transition={{ delay:0.2, duration: 0.8 }}
            animate={{ opacity: 1, y: 0 }}

            >
                <p>Best text to image generator</p>
                <img src={assets.star_icon} alt="" />
            </motion.div>
            {/* heading here */}
            <motion.h1 className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center'
            
            initial={{ opacity: 0 }}
            transition={{ delay:0.4, duration: 2 }}
            animate={{ opacity: 1}}
            

            >Turn text to <span className='text-blue-600'>image</span>, in seconds.</motion.h1>
            {/* description here */}
            <motion.p className='text-center max-w-xl mx-auto mt-5'
            
             
            initial={{ opacity: 0 , y:20}}
            transition={{ delay:0.6, duration: 0.8 }}
            animate={{ opacity: 1, y:0}}

            >Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type, and watch the magic happen.</motion.p>
            {/* generate button here  */}
            <motion.button className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full'
            
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
            initial = {{opacity:0}}
            animate ={{opacity:1}}
            transition ={{default:{duration:0.5}, opacity:{delay:0.8, duration:1}}}

            onClick={onClickHandler}
            >
                Generate Images
                <img src={assets.star_group} alt="" className='h-6' />
            </motion.button>
            {/*  displaying the images in the header sections */}
            <motion.div className='flex flex-wrap gap-3 mt-16 justify-center'
             
            initial={{ opacity: 0 }}
            transition={{ delay:1, duration: 1 }}
            animate={{ opacity: 1}}
            
            >
                {Array(6).fill('').map((item, index) => (
                    <motion.img className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10' src={index % 2 == 0 ? assets.sample_img_1 : assets.sample_img_2} alt="" key={index} width={70} 
                    
                    whileHover={{scale:1.05, duration:0.1}}
                    />
                ))}
            </motion.div>
            <motion.p className='mt-2 text-neutral-600'
            initial = {{opacity: 0}}
            animate = {{opacity: 1}}
            transition = {{delay:1.2, duration: 0.8}}
            >Generated images from the imagify.</motion.p>
        </motion.div>
    )
}

export default Header
