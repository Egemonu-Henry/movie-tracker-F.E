import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Login = ({setUser}) => {
  const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();
    const handleChange = (e) =>{
        setFormData({...formData, [e.target.name]:e.target.value})
    } 

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
          const res = await axios.post("/api/user/login", formData)
          localStorage.setItem("token", res.data.token);
          setUser(res.data);
          toast.success(res.data.message || "Logged in successfully");
          navigate("/")

          

        } catch (error) {

          const message =
          error.response?.data?.message || "Something went wrong. Please try again.";

          toast.error(message);
          console.error("Login failed:", error.response?.data?.message || error.message);
        } 

    }
  return (
    <div className=' min-h-screen flex justify-center items-center bg-gradient-to-br from-[#050505] via-[#1a1a1a] to-[#010101]  '>
      <div className="flex flex-col bg-white/10 backdrop-blur-xl w-full max-w-md rounded-xl shadow-2xl p-8 m-4 border border-white/20">
        <h2 className='text-2xl font-bold text-center text-white mb-6' >Login</h2>
        <form onSubmit={handleSubmit}>
            <div className='flex flex-col  gap-4 mb-3' >
                <input type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder='Input Your Email' 
                required 
                autoComplete='on'
                className='w-full bg-gray-500 outline-none rounded-full placeholder-white text-white text-[15px] font-semibold p-2'
                />
                <input type="password" 
                name='password' 
                value={formData.password} 
                onChange={handleChange} 
                placeholder='Password' 
                required 
                className='w-full bg-gray-500 outline-none rounded-full placeholder-white text-white p-2 text-[15px] font-semibold focus:ring-2 focus:ring-amber-500 '
                /> 
            </div>
            
            <button 
            className="inline-flex w-full cursor-pointer items-center justify-center  rounded-full bg-gray-400 p-2 pl-0 m-0 font-['Onest',sans-serif] text-[15px] font-semibold text-white outline-none transition-[background-color,transform,box-shadow] duration-200 hover:bg-gray-500 active:not-disabled:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >Login 
            </button>
          
        </form>
      </div>
      
    </div>
  )
}

export default Login
