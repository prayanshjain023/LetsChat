import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { FaCirclePlus, FaArrowRightFromBracket } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdSunny, MdPeopleAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../Features/ThemeSlice";
import axios from "axios";
import { motion } from "framer-motion";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lighttheme = useSelector((state) => state.themekey);
  const [usersAllConversations, setUsersAllConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogout, setShowLogout] = useState(false); // State for showing/hiding the logout button

  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!storedUserData || !storedUserData.token) {
      console.log("User not authenticated");
      navigate("/login"); // Redirect to login if no token is found
    } else {
      const config = {
        headers: {
          Authorization: `Bearer ${storedUserData.token}`, // Directly use the token
        },
      };
      axios
        .get("http://localhost:8282/chat/", config)
        .then((response) => {
          setUsersAllConversations(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          navigate("/"); // Redirect if API call fails
        });
    }
  }, [storedUserData, navigate]);

  // Filter users based on search term
  const filteredUsers = usersAllConversations.filter((chat) =>
    chat?.chatName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("storedUserData"); // Remove user data from localStorage
    navigate("/login"); // Navigate to login page
  };

  return (
    <div className="w-[35%] h-full gap-y-3 flex flex-col">
      {/* Top bar */}
      <div
        className={`w-full ${
          lighttheme ? "bg-white text-gray-500" : "bg-black text-zinc-300"
        } h-[9vh] rounded-lg flex justify-between shadow-lg overflow-hidden`}
      >
        <div className="text-2xl w-[50%] h-full flex items-center ml-5">
          <h1
            className="duration-300 cursor-pointer hover:scale-110"
            onClick={() => setShowLogout(!showLogout)} // Toggle the visibility of the logout button
          >
            <FaUserCircle />
          </h1>
          {showLogout && (
            <motion.button
              className="px-4 py-2 ml-3 text-sm font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
            >
              Logout
            </motion.button>
          )}
        </div>

        <div
          className={`text-2xl ${
            lighttheme ? "bg-white text-gray-500" : "bg-black text-zinc-300"
          } flex gap-5 w-[70%] h-full justify-center items-center`}
        >
          <MdPeopleAlt onClick={() => navigate("/home/users")} />
          <TiGroup onClick={() => navigate("/home/allgroup")} />
          <FaCirclePlus onClick={() => navigate("/home/creategroup")} />
          <h1
            onClick={() => {
              dispatch(toggleTheme());
            }}
          >
            {lighttheme ? <FaMoon /> : <MdSunny />}
          </h1>
          <FaArrowRightFromBracket
            onClick={() => {
              localStorage.removeItem("userData");
              navigate("/login");
            }}
          />
        </div>
      </div>

      {/* Search bar */}
      <div
        className={`${
          lighttheme ? "bg-white text-gray-500" : "bg-black text-zinc-300"
        } h-[9vh] w-full rounded-md shadow-lg`}
      >
        <div className="flex items-center w-full h-full gap-4 ml-5 text-3xl text-gray-600 text-[18px]">
          <IoSearch className="cursor-pointer" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${
              lighttheme ? "bg-white text-gray-500" : "bg-black text-zinc-300"
            } outline-none`}
            placeholder="Search"
          />
        </div>
      </div>

      {/* Users list */}
      <div
        className={`${
          lighttheme ? "bg-zinc-100 text-gray-500" : "bg-black text-zinc-300"
        } h-[75vh] shadow-lg w-full rounded-md p-2 flex flex-col gap-2 overflow-y-auto`}
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((chat, index) => {
            const chatName = chat.chatName || "Unnamed Chat"; // Fallback if chatName is missing
            const firstLetter = chatName[0] || "?"; // Handle empty chatName
            return (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={chat._id}
                className={`w-full h-[8vh] rounded-md flex ${
                  lighttheme
                    ? "bg-white text-gray-500"
                    : "bg-zinc-900 text-zinc-300 hover:bg-slate-700"
                } hover:bg-slate-200 duration-150 cursor-pointer`}
                onClick={() => navigate(`/chat/${chat._id}`)}
              >
                <div className="w-[70%] h-full flex px-2 py-2 gap-3 items-center">
                  <div className="bg-gray-300 rounded-full w-[43px] h-[43px] flex items-center justify-center text-zinc-100 text-2xl font-semibold">
                    <h1>{firstLetter}</h1>
                  </div>
                  <div>
                    <h1 className="font-semibold">{chatName}</h1>
                    {/* Conditionally render latest message */}
                    {chat.latestMessage && (
                      <p>{chat.latestMessage.content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p>No conversations found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
