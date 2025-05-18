import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

function Navbar() {
    // tells you when the user is logged-in or logged-out 
    const { user } = useContext(AppContext);

    // pricing waale option mai click karte hi doosre page mai redirect ho jaayein 
    const navigate = useNavigate()

    // login button par click karte hue login form khul jaana chaahiye 
    const { setShowLogin, logout, credit } = useContext(AppContext);

    return (
        <div className='flex items-center justify-between py-4'>
            {/* configuring the logo */}
            <Link to='/'><img src={assets.logo} alt="Logo" className='w-28 sm:w-32 lg:w-40' /></Link>
            {/* login or logout buttons etc .. right side part */}
            <div>
                {user ?

                    /* logged-in user */
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <button onClick={() => navigate('/buy')} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
                            <img src={assets.credit_star} alt="credits-left" />
                            <p className='text-xs sm:text-sm font-medium text-gray-600'>Credit Left : {credit}</p>
                        </button>
                        <p className='text-gray-600 max-sm:hidden pl-4'>{user.name}</p>
                        {/* profile icon */}
                        <div className='relative group'>
                            {/* profile-icon  */}
                            <img src={assets.profile_icon} alt="user-profile-icon" className='w-10 drop-shadow' />
                            {/* logout div comes upon hovering */}
                            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                                {/* adding logout link */}
                                <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm '>
                                    <li onClick={logout} className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                                </ul>

                            </div>
                        </div>

                    </div>
                    :
                    /* logged-out user  */
                    <div className='flex items-center gap-2 sm:gap-5'>
                        <p onClick={() => navigate('/buy')} className='cursor-pointer'>Pricing</p>
                        {/* login button here */}
                        <button onClick={() => setShowLogin(true)} className='bg-zinc-800 text-white px-7 py-2 sm:px-10 rounded-full'>Login</button>
                    </div>
                }
            </div>
        </div >
    )
}

export default Navbar
