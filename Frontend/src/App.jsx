import React from 'react'
import Login from './Components/Login'
import { Route, Routes } from 'react-router-dom'
import Signup from './Components/Signup'
import WelcomePage from './Components/MainFolder/WelcomePage'
import Home from './Components/Home'
import { useSelector } from 'react-redux'
import ChatArea from './Components/MainFolder/ChatArea'
import AllUsers from './Components/MainFolder/AllUsers'
import CreateGroup from './Components/MainFolder/CreateGroup'
import AllGroup from './Components/MainFolder/AllGroup'

const App = () => {
  const lighttheme = useSelector((state)=>state.themekey)
  return (
    <>
    <div className={`h-[100vh] w-[100%] ${lighttheme?'bg-zinc-100' : 'bg-black'} flex justify-center items-center`}>
      <Routes>
      <Route path='/' element={<Signup />} ></Route>
      <Route path='/login' element={<Login />} ></Route>
      <Route path='home' element={<Home></Home>}>
      <Route path='welcomepage' element={<WelcomePage />} ></Route>
      <Route path='chatarea/:_id' element={<ChatArea />} ></Route>
      <Route path='users' element={<AllUsers />} ></Route>
      <Route path='allgroup' element={<AllGroup />} ></Route>
      <Route path='creategroup' element={<CreateGroup />} ></Route>
      </Route>
      </Routes>
    </div>
    </>
  )
}

export default App
