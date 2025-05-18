import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';


function GenerateBtn() {
    // is user logged-in or not 
    const { user } = useContext(AppContext);
    // to navigate on the other pages 
    const navigate = useNavigate();
    // if the user is not logged in then, if he click on the generate images button then, he has to firstly login .. so we need to open the login form in that case 
    // for that we have to change the showLoginState to true 
    const { setShowLogin } = useContext(AppContext);
    // generate images button handler 
    function onClickHandler() {
        if (user) {
            navigate('/result')
        } else {
            setShowLogin(true);
        }
    }
    return (
        <div className='pb-16 text-center'>
            <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16'>See the magic. Try now</h1>
            <button
                onClick={onClickHandler}
                className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto hover:scale-105 transition-all duration-500'>
                Generate Images
                <img src={assets.star_group} alt="" className='h-6' />
            </button>
        </div>
    )
}

export default GenerateBtn
