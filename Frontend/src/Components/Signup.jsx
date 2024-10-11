import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import logo from '../assets/logo.png';

const Signup = () => {
  const navigate = useNavigate(); // Navigation hook for redirection
  const [data, setData] = useState({ name: "", email: "", password: "" }); 
  
  const changeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value, // Correct input value handling
    });
  };


  const handleSignup = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json", // Ensure JSON format for API call
        },
      };
  
      const response = await axios.post(
        "http://localhost:8282/user/signup",
        data, // Sending the data object with username and password
        config
      );
      console.log("Signup Success:", response.data); // Log the full response to ensure structure
  
      // Save the token to localStorage
      localStorage.setItem("userData", JSON.stringify(response.data)); // Saving the token directly
      console.log("Token saved:", response.data.token); // Check if token is saved
  
      // Redirect to welcome page
      navigate("/home/welcomepage");
    } catch (error) {
      console.log("Signup Error:", error);
      if (error.response && error.response.status === 409) {
        console.log("User already exists. Please login.");
      }
    }
  };
  
  

  return (
    <div className="w-[85%] h-[85%] shadow-lg bg-white rounded-lg flex gap-x-5 overflow-hidden p-5">
      <div className="w-[35%] h-full rounded-lg flex items-center justify-center">
        <img src={logo} className="w-40 h-40" alt="logo" />
      </div>
      <div className="bg-zinc-100 w-[65%] h-full rounded-lg flex flex-col justify-center items-center p-4 gap-5">
        <h1 className="mb-2 text-2xl font-bold ">Signup</h1>

        {/* Username Input */}
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={changeHandler}
          placeholder="Enter your username"
          className="w-[40%] p-2 pl-6 h-10 text-sm text-gray-700"
        />

        {/* Email Input */}
        <input
          type="text"
          name="email"
          value={data.email}
          onChange={changeHandler}
          placeholder="Enter your email"
          className="w-[40%] p-2 pl-6 h-10 text-sm text-gray-700"
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={changeHandler}
          placeholder="Enter your password"
          className="w-[40%] p-2 pl-6 h-10 text-sm text-gray-700"
        />

        {/* Error message */}
        {/* {error && <div className="text-red-500"> {error}</div>} */}

        {/* Signup button */}
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={handleSignup}
        >
          Signup
        </button>

        {/* Login link for existing users */}
        <h5 className="font-medium">
          Already have an account?{" "}
          <Link to='/login' className="text-indigo-600 hover:underline">Login</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
