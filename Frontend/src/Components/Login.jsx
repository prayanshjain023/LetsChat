import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", password: "" });
  
  const changeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value, // Correct input value handling
    });
  };

  const handleLogin = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        'http://localhost:8282/user/login',
        data, // Sending the data object with username and password
        config
      );
      console.log("Login Success:", response);
      navigate('/home/welcomepage');
      localStorage.setItem('userData', JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[85%] h-[85%] shadow-lg bg-white rounded-lg flex gap-x-5 overflow-hidden p-5">
    <div className="w-[35%] h-full rounded-lg flex items-center justify-center ">
      <img src={logo} className="w-40 h-40" alt="Logo" />
    </div>
    <div className="bg-zinc-100 w-[65%] h-full rounded-lg flex flex-col justify-center items-center p-4 gap-5">
      <h1 className="mb-2 text-2xl font-bold uppercase">Login</h1>
      
      <input
        type="text"
        name="name"
        value={data.name}
        onChange={changeHandler}
        placeholder="Username"
        className="w-[40%] p-2 pl-6 h-10 text-sm text-gray-700"
      />
      
      <input
        type="password"
        name="password"
        value={data.password}
        onChange={changeHandler}
        placeholder="Password"
        className="w-[40%] p-2 pl-6 h-10 text-sm text-gray-700"
      />
      
      {/* {error && <div className="text-red-500">{error}</div>} */}
      
      <button
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={handleLogin}
      >Login
      </button>
      
      <h5 className="font-medium">
        Create an account!{" "}
        <Link to='/' className="text-indigo-600 hover:underline">Signup</Link>
      </h5>
    </div>
  </div>
  );
};

export default Login;
