import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
// importing all of the pages 
import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import PaymentSuccess from './pages/PaymentSuccess'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import { ToastContainer, toast } from 'react-toastify'; // importing the toast-container 

function App() {
  // login form opened or not that information 
  const { showLogin } = useContext(AppContext);
  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <ToastContainer position='bottom-right'></ToastContainer>
      <Navbar />
      {/* the Login component */}
      {showLogin && <Login />}
      {/* routes to the pages are defined */}
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/result' element={<Result />}></Route>
        <Route path='/buy' element={<BuyCredit />}></Route>
        <Route path='/payment-success' element={<PaymentSuccess />}></Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
