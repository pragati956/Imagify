/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";

export const AppContext =createContext()
const AppContextProvider = (props)=>{
     const [user, setUser] = useState(null);

     const [showLogin,setShowLogin]=useState(false);

     const [token,setToken]=useState(localStorage.getItem('token'))
     const [credit,setCredit]=useState(false);
     // --- ADD THIS DARK MODE LOGIC ---
     const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
     useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
     }, [theme]);
     const backendUrl=import.meta.env.VITE_BACKEND_URL
     const navigate= useNavigate()
     const enhancePrompt = async (prompt) => {

  try {

    const { data } = await axios.post(

      backendUrl + "/api/image/enhance-prompt",

      { prompt },

      {
        headers: { token }
      }

    );

    if(data.success){

      return data.enhancedPrompt;

    }

    return "";

  }

  catch(error){

    console.log(error);

    return "";

  }

}
     
     const loadCredits = useCallback(async () => {
      try {
         const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: { token } })
         if (data.success) {
            setCredit(data.credits)
            setUser(data.user)
         }
      }
      catch (error) {
         console.log(error)
         toast.error(error.message)
      }
     }, [backendUrl, token]);
     const generateImage=async(prompt, referenceImage = null)=>{ // Added referenceImage parameter
      try{
       const formData = new FormData(); // Switched payload to FormData
       formData.append("prompt", prompt);
       if (referenceImage) {
         formData.append("referenceImage", referenceImage);
       }

       const {data}=await axios.post(backendUrl + '/api/image/generate-image', formData, { // Passed formData
           headers: {
               token,
           }
       })
       if (data.success) {
 loadCredits();

 return {
   image: data.resultImage,
   originalPrompt: data.originalPrompt,
 };
}       else{
         toast.error(data.message)
         loadCredits()
         if(data.creditBalance===0)
         {
            navigate('/buy')
         }
         return null;
       }

      }
      catch(error){
         toast.error(error.message)
         return null;
      }
     }
     const logout = () => {
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
      navigate('/'); // Added this line to redirect to home upon logout
     }
     useEffect(() => {
      if (!token) return;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadCredits();
     }, [token, loadCredits]);
     const value={
        user,setUser,showLogin,setShowLogin,backendUrl,token,setToken,credit,setCredit,loadCredits,logout,generateImage,enhancePrompt, theme, setTheme
     }
     return (
        <AppContext.Provider
            value={value}>
            {props.children}
        </AppContext.Provider>
     )
}
export default AppContextProvider;

