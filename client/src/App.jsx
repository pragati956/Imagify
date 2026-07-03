import React, { useContext } from 'react'

import { Routes, Route } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify';
// Add this import
import MyCreations from './pages/MyCreations'


import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Login from './components/auth/Login'



const App = () => {
  const { showLogin } = useContext(AppContext)
  return (
<div className="min-h-screen bg-gradient-to-b from-teal-100 to-orange-200">      <ToastContainer position='bottom-right' />
     <Navbar />

{showLogin && <Login />}

<main className="max-w-7xl mx-auto px-6 lg:px-8">
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/buy" element={<BuyCredit />} />
        <Route path="/creations" element={<MyCreations />} />
    </Routes>
</main>

<Footer />
    </div>
  )
}

export default App
