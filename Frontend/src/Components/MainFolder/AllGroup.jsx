import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllGroup = () => {

  const lighttheme = useSelector((state) => state.themekey);
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  const userData = storedUserData.data;
  const [groups, setGroups] = useState([])

  useEffect(()=>{
    const config = {
      headers: {
        Authorization: `Bearer ${storedUserData.token}`, // Directly use the token
      },
    };
    axios
    .get("http://localhost:8282/chat/fetchgroup",config)
    .then((response)=>{
      // console.log("Group Data from API ", response.data);
      setGroups(response.data);
    })
  })

  const [searchTerm, setSearchTerm] = useState('');

  //Filter groups based on the search term
  const filteredGroups = groups.filter((group) =>
    group.chatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='w-[70%] h-full gap-y-3 flex flex-col rounded-lg'>
      <div className={`w-full ${lighttheme ? 'bg-white text-gray-500' : 'bg-black text-zinc-300'} h-[9vh] py-1 rounded-lg gap-3 flex items-center overflow-hidden`}>
        <img src={logo} className='w-8 h-8 ml-5' alt="logo" />
        <h1 className='font-semibold'>Available Groups</h1>
      </div>
      
      {/* Search input */}
      <div className={`${lighttheme ? 'bg-white text-gray-500' : 'bg-black text-zinc-300'} h-[9vh] py-1 w-full rounded-md`}>
        <div className="flex items-center w-full h-full gap-4 ml-5 text-2xl text-gray-600">
          <h1>
            <IoSearch />
          </h1>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${lighttheme ? 'bg-white text-gray-500' : 'bg-black text-zinc-300'} outline-none text-[18px]`}
            placeholder="Search for a group"
          />
        </div>
      </div>

      {/* Group list */}
      <div className="h-[80vh] w-full rounded-md flex flex-col gap-2 overflow-y-auto">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, index) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`w-full h-[8vh] rounded-md flex ${lighttheme ? 'bg-white text-gray-500' : 'bg-zinc-950 text-zinc-300 hover:bg-slate-800'} hover:bg-slate-200 duration-150 cursor-pointer`}
              key={index}
              onClick={()=>{
                const config = {
                  headers: {
                    Authorization: `Bearer ${storedUserData.token}`, // Directly use the token
                  },
                };
                axios
                .put("http://localhost:8282/chat/addSelftogroup",{
                  chatId:group._id,
                  userId:storedUserData.data._id
                }, config)
              }}
            >
              <div className="w-[70%] h-full flex px-2 py-2 gap-3 items-center">
                <div className="bg-gray-300 rounded-full w-[40px] h-[40px] flex items-center justify-center text-zinc-100 text-2xl font-semibold">
                  <h1>{group.chatName[0].toUpperCase()}</h1>
                </div>
                <div>
                  <h1 className="font-semibold">{group.chatName}</h1>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No groups found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default AllGroup;
