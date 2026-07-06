
import React, { useContext, useEffect, useState } from 'react'
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { motion as Motion } from "motion/react"

import axios from 'axios'
import { toast } from 'react-toastify';
const Login = () => {
    const [state, setState] = useState('Login')
    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                }

                else {
                    toast.error(data.message)
                }
            }
            else {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                }

                else {
                    toast.error(data.message)
                }

            }
        }
        catch (error) {
            toast.error(error.message)

        }
        finally {

        setLoading(false);

    }
    }
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';

        }
    }, [])
    return (
<div
className="fixed inset-0 z-10 backdrop-blur-sm bg-black/40 flex justify-center items-center"
onClick={()=>setShowLogin(false)}
>
            <Motion.form onSubmit={onSubmitHandler}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} className="
relative
bg-white
w-[90%]
max-w-md
p-6
sm:p-8
rounded-2xl
text-slate-500
shadow-xl
" >
                <h1 className='text-center text-2xl text-neutral-800 font-semibold'>{state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>
                {state !== 'Login' && <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>

                    <img src={assets.user_icon} alt="" />

                    <input onChange={e => setName(e.target.value)} value={name} type="text" className="
flex-1
outline-none
text-sm
bg-transparent
"
placeholder="Full-Name" required />
                </div>
                }
                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>

                    <img src={assets.email_icon} alt="" />

                    <input onChange={e => setEmail(e.target.value)} value={email} type="email" className="
flex-1
outline-none
text-sm
bg-transparent
"
placeholder="Email-id" required />
                </div>
                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>

                    <img src={assets.lock_icon} alt="" />

                    <input onChange={e => setPassword(e.target.value)} value={password} type="password" className="
flex-1
outline-none
text-sm
bg-transparent
"
placeholder="Password" required />
                </div>

               <button
type="submit"
disabled={loading}
className="
bg-blue-600
hover:bg-blue-700
disabled:bg-blue-400
disabled:cursor-not-allowed
transition-all
duration-300
w-full
text-white
py-2.5
rounded-full
font-medium
"
>
{
loading
?
"Please wait..."
:
state==="Login"
?
"Login"
:
"Create Account"
}
</button>
                {state === 'Login' ? <p className='mt-5 text-center'>Don't have an account?
                    <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}>Sign up</span>
                </p> :
                    <p className='mt-5 text-center'>Already have an account?
                        <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</span>
                    </p>}

                <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className="
absolute
top-4
right-4
w-5
h-5
cursor-pointer
hover:scale-110
transition
" />
            </Motion.form>

        </div>
    )
}

export default Login
