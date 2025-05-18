import { createContext, useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext(); // create your own context provider 

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const [user, setUser] = useState(null); // user logged in hai ya nahi 

    const [showLogin, setShowLogin] = useState(false); // login form khula hai ya nahi 

    const [token, setToken] = useState(localStorage.getItem('token')); // token ko local storage se nikaalte hai 

    const [credit, setCredit] = useState(false);

    const navigate = useNavigate();

    // we have to find the credit value using api 
    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: { token } });
            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    // onchanging of the token
    useEffect(() => {
        if (token) {
            loadCreditsData()
        }
    }, [token])

    // logout functionalities 
    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    }
    // generate-image api 
    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/image/generate-image', { 
                prompt,
                userId: user._id 
            }, { 
                headers: { token } 
            });

            if (data.success) {
                loadCreditsData();
                return data.resultImage;
            } else {
                if (data.message === 'No Credit Balance') {
                    toast.error('Insufficient credits. Redirecting to purchase page...');
                    navigate('/buy');
                    return null;
                }
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error('Generate image error:', error);
            toast.error(error.response?.data?.message || 'Error generating image');
            loadCreditsData();
            
            // Check if the error is due to no credits
            if (error.response?.data?.message === 'No Credit Balance') {
                toast.error('Insufficient credits. Redirecting to purchase page...');
                navigate('/buy');
            }
            return null;
        }
    }


    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        generateImage
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;