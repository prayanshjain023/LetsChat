import React from 'react'
import Sidebar from './MainFolder/Sidebar'
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const lighttheme = useSelector((state)=>state.themekey)
  return (
    <div className={`${lighttheme?'bg-zinc-100' : 'bg-neutral-800'} w-[80%] h-[85vh] rounded-lg overflow-hidden flex p-5 gap-5`}>
    <Sidebar />
    <Outlet />
    </div>
  )
}

export default Home
