import axios from 'axios';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [groupName, setGroupName] = useState('');
  const [open, setOpen] = useState(false)
  const lighttheme = useSelector((state) => state.themekey);
  const navigate = useNavigate();
  if (!storedUserData || !storedUserData.token) {
    console.log("User not authenticated");
    navigate("/login"); // Redirect to login if no token is found
  } 
  const userData = storedUserData.data;
  // const user = userData.data;

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleClickOpen = (e) => {
    setOpen(true);
  }
  const handleClickClose = (e) => {
    setOpen(false);
  }

  const createGroup = () =>{
    const config = {
      headers: {
        Authorization: `Bearer ${storedUserData.token}`, // Directly use the token
      },
    };
    axios
    .post("http://localhost:8282/chat/createchat", {
      name: groupName,
      users: ["67053173f6b686dc02d00fe7", "6705329cf6b686dc02d00feb"],  // Fix: Properly pass users as an array
    }, config)
    .then(() => {
      navigate('/home/allgroup');
    })
    .catch((error) => {
      console.error("Error creating group:", error);
    });
  }

  return (
    <div className={`w-[70%] h-full ${lighttheme ? 'bg-white text-gray-500' : 'bg-black text-zinc-300'} rounded-lg`}>
      <div className="flex flex-col items-center justify-center h-full p-4 gap-y-4">
        <h1 className="mb-4 text-3xl font-bold">Create a new group</h1>
        
        {/* Group Name Input */}
        <input
          type="text"
          value={groupName}
          onChange={handleGroupNameChange}
          placeholder="Enter group name"
          className={`w-[40%] p-2 pl-3 text-sm outline-none rounded-lg ${lighttheme ? 'bg-white text-gray-500 border border-gray-300' : 'bg-black text-zinc-300 border border-zinc-600'}`}
        />

        {/* Members List */}
        {/* <div className="w-[40%] mt-4">
          {members.length > 0 ? (
            <ul className="space-y-2">
              {members.map((member, index) => (
                <li
                  key={index}
                  onClick={() => handleMemberSelect(index)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${member.isSelected ? 'bg-blue-500 text-white' : lighttheme ? 'bg-gray-100 text-gray-700' : 'bg-zinc-800 text-zinc-200'}`}
                >
                  <span>{member.name}</span>
                  {member.isSelected && <span>✓</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No members added yet.</p>
          )}
        </div> */}

        {/* Create Group Button */}
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
          onClick={createGroup}
        >
          Create group
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
