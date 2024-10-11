import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search input
  const [status, setStatus] = useState(""); // State to track search status
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lighttheme = useSelector((state) => state.themekey);
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  if (!userData) {
    console.log("User not Authenticated");
    navigate('/');
  }

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    
    if (!storedUserData || !storedUserData.token) {
      console.log("User not authenticated");
      navigate("/login");
    } else {
      const config = {
        headers: {
          Authorization: `Bearer ${storedUserData.token}`, // Use the token from localStorage
        },
      };
      axios
        .get("http://localhost:8282/user/fetchusers", config)
        .then((response) => {
          // console.log("User data from API: ", response);
          setAllUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          navigate("/");
        });
    }
  }, [navigate]);

  // Filter users based on the search query
  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (filteredUsers.length === 0) {
      setStatus("No users found matching your search criteria.");
    } else {
      setStatus(""); // Clear status if users are found
    }
  }, [filteredUsers]);

  return (
    <div className='w-[70%] h-full gap-y-3 flex flex-col rounded-lg'>
      <div className={`w-full ${lighttheme ? 'bg-white text-gray-500' : 'bg-black text-zinc-300'} h-[9vh] py-1 rounded-lg gap-3 flex items-center overflow-hidden`}>
        <img src={logo} className='w-8 h-8 ml-5' alt="" />
        <h1 className='font-semibold'>Online Users</h1>
      </div>
      
      <div className={`${lighttheme ? 'bg-white text-gray-500' : 'bg-black text-zinc-300'} h-[9vh] py-1 w-full rounded-md`}>
        <div className="flex items-center w-full h-full gap-4 ml-5 text-2xl text-gray-600">
          <h1><IoSearch /></h1>
          <input
            type="text"
            className={`outline-none text-[18px] ${lighttheme ? 'bg-white text-gray-500' : 'bg-black text-zinc-300'}`}
            placeholder="Search"
            value={searchQuery} // Bind the input to searchQuery state
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
          />
        </div>
      </div>

      {/* If status is set, show the message */}
      {status && (
        <div className="font-semibold text-center text-red-500">
          {status}
        </div>
      )}

      <div className="h-[80vh] w-full rounded-md flex flex-col gap-2 overflow-y-auto">
        {/* Render filtered users */}
        {filteredUsers.map((data, index) => (
          <motion.div
            onClick={() => {
              console.log("Creating chat with " +data.name);
              const config = {
                headers: {
                  'Authorization': `Bearer ${userData.token}`,
                },
              };
              axios.post('http://localhost:8181/chat/', { userId: data._id }, config);
            }}
            key={index}
            whileHover={{ scale: 1.02 }}
            className={`w-full py-1 h-[8vh] rounded-md flex ${lighttheme ? 'bg-white text-gray-500' : 'bg-zinc-950 text-zinc-300 hover:bg-slate-800'} hover:bg-slate-200 duration-150 cursor-pointer`}
          >
            <div className="w-[70%] h-full flex px-2 py-2 gap-3 items-center">
              <div className="bg-gray-300 rounded-full w-[40px] h-[40px] flex items-center justify-center text-zinc-100 text-2xl font-semibold">
                <h1>{data.name[0].toUpperCase()}</h1>
              </div>
              <div>
                <h1 className="font-semibold">{data.name}</h1>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
