import React, { useContext } from 'react'
import { assets, plans } from "../assets/assets";
import { AppContext } from '../context/AppContext'
import { motion as Motion } from "motion/react"
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BuyCredit = () => {
  const { user, backendUrl, loadCredits, token, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Credits Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verify-payment', response, { headers: { token } })
          if (data.success) {
            loadCredits();
            navigate('/')
            toast.success('Credit Added')
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    }
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load");
      return;
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true)
        return
      }
      const { data } = await axios.post(
        backendUrl + '/api/user/pay-razor',
        { planId },
        { headers: { token } }
      )
      if (data.success) {
        initPay(data.order)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10 px-6 relative"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-6 top-14 flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 hover:scale-105 transition-all duration-300"
      >
        <ArrowLeft className="text-gray-700 dark:text-gray-300" size={22} />
      </button>

      <button className="border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-10 py-2 rounded-full mb-6 transition-colors">
        Our Plans
      </button>
      <h1 className="text-3xl font-medium mb-10 text-gray-800 dark:text-gray-100 transition-colors">
        Choose the plan
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 drop-shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg py-12 px-8 text-gray-600 dark:text-gray-300 hover:scale-105 transition-all duration-500"
          >
            <img width={40} src={assets.logo_icon} alt="" className="dark:brightness-0 dark:invert" />
            <p className="mt-3 mb-1 font-semibold text-gray-800 dark:text-gray-100 transition-colors">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium text-gray-900 dark:text-white transition-colors">{item.price}</span> / {item.credits} credits
            </p>
            <button
              onClick={() => paymentRazorpay(item.id)}
              className="w-full bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 mt-8 text-sm rounded-md py-2.5 min-w-52 hover:scale-105 transition-all duration-300"
            >
              {user ? 'Purchase' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </Motion.div>
  )
}
export default BuyCredit;