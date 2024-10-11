import React from "react";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const lighttheme = useSelector((state) => state.themekey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();

  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  return (
    <div
      className={`w-[70%] h-full ${
        lighttheme ? "bg-white text-gray-700" : "bg-black text-gray-300"
      } rounded-lg overflow-hidden flex justify-center items-center border-b-4 border-[#06DAAE] relative`}
    >
      <div className="flex flex-col items-center text-center gap-y-10">
        <h1
          className="mb-4 text-2xl font-semibold"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Hi, {userData.name} 👋
        </h1>
        <img src={logo} className="w-[45%] h-[45%] mb-4" alt="App logo" />
        <h1 className="px-5 text-sm text-gray-500">
          View and text directly to people in the present in the chat rooms.
        </h1>
      </div>
    </div>
  );
};

export default WelcomePage;
