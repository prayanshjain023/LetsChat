import React, { useEffect, useState } from 'react'
import { FaTrash } from "react-icons/fa";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import MessageSelf from './MessageSelf';
import MessageOther from './MessageOther';
import { useSelector } from 'react-redux';
import { IoSend } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatArea = ({userdata}) => {

    const lighttheme = useSelector((state)=>state.themekey)
    const [messageContent, setMessageContent] = useState('');
    const messagesEndRef = useRef(null);
    const dyParams = useParams();
    const [chat_id, chat_user] = dyParams._id.split("&");
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const [allMessages, setAllmessages] = useState([]);
    const [allMessagesCopy, setAllmessagesCopy] = useState([]);

    const sendMessage = () =>{
      var data = null;
      const config = {
        headers: {
          Authorization: `Bearer ${storedUserData.token}`, // Directly use the token
        },
      };
      axios
      .post("http://localhost:8282/message/",{
        content:messageContent,
        chatId:chat_id,
        }, config).then((response)=>{
          data = response;
          console.log('Message Fired'+response);
        })
    }

    useEffect(()=>{
      const config = {
        headers: {
          Authorization: `Bearer ${storedUserData.token}`, // Directly use the token
        },
      };
      axios
      .get("http://localhost:8282/message/"+chat_id,config)
      .then((response)=>{
          setAllmessages(response);
        });
        setAllmessagesCopy(allMessages);
    },[chat_id, storedUserData.token, allMessages])

    const messages = [
      {
        type: 'self',
        text: 'Hey There!',
        time: 'Today, 8:30pm',
      },
      {
        type: 'other',
        text: 'How are you?',
        time: 'Today, 8:30pm',
      },
      {
        type: 'other',
        text: 'Hello!',
        time: 'Today, 8:33pm',
      },
      {
        type: 'self',
        text: 'I’m good, just finished work. You?',
        time: 'Today, 8:34pm',
      },
      {
        type: 'other',
        text: 'Same here, just relaxing now.',
        time: 'Today, 8:35pm',
      },
      {
        type: 'self',
        text: 'Nice! Any plans for tonight?',
        time: 'Today, 8:36pm',
      },
      {
        type: 'other',
        text: 'Not sure yet. Might watch a movie. Any recommendations?',
        time: 'Today, 8:37pm',
      },
      {
        type: 'self',
        text: 'Ooh, how about “Inception”? It’s a classic.',
        time: 'Today, 8:38pm',
      },
      {
        type: 'other',
        text: 'I’ve seen it like 5 times, haha! Something new?',
        time: 'Today, 8:39pm',
      },
      {
        type: 'self',
        text: 'Hmm, have you checked out “The Prestige”? Same director, mind-blowing twists.',
        time: 'Today, 8:41pm',
      },
      {
        type: 'other',
        text: 'Nope, but I love twists! Adding it to my list!',
        time: 'Today, 8:42pm',
      },
      {
        type: 'self',
        text: 'You’ll thank me later. 😄',
        time: 'Today, 8:43pm',
      },
      {
        type: 'other',
        text: 'For sure! What are you up to now?',
        time: 'Today, 8:44pm',
      },
      {
        type: 'self',
        text: 'Probably going to cook dinner. Trying a new pasta recipe.',
        time: 'Today, 8:45pm',
      },]      
  return (
    <div className={`w-[70%] h-full gap-y-3 flex flex-col rounded-lg`}>
      <div className={`w-full h-[8vh] ${lighttheme?'bg-white':'bg-black'} rounded-lg flex justify-start items-center px-2 gap-2`}>
       <div className={`bg-gray-300 rounded-full w-[36px] h-[36px] flex items-center justify-center ${lighttheme?'text-zinc-100':'text-zinc-600'}  text-2xl font-semibold`}>R</div>
       <div><h1 className={`${lighttheme ? 'text-zinc-700':'text-zinc-300'} font-semibold`}>Rohan</h1></div>
      </div>
      <div className={`flex flex-col space-y-2 overflow-hidden h-[80%] w-full overflow-y-auto ${lighttheme?'bg-white text-black':'bg-black text-zinc-100'} p-3 rounded-lg`}>
        {allMessages.slice(0).reverse().map((msg, index) => {
          const sender = msg.sender;
          const self_id = storedUserData.data._id;
          if(sender._id === self_id) {
            return <MessageSelf props={msg} key={index} />
          }else{
            return <MessageOther props={msg} key={index} />
          }})}
      </div>
      <div  ref={messagesEndRef} className={`w-full h-[8vh] ${lighttheme?'bg-white':'bg-black'} rounded-lg flex items-center justify-between px-4`}>
      <input
            type="text"
            className={`${
              lighttheme ? "bg-white text-gray-500" : "bg-black text-zinc-300"
            } outline-none`}
            value={messageContent}
            onChange={(event)=>{
              setMessageContent(event.target.value);
            }}
            placeholder="Write a message.."
            onKeyDown={(event)=>{
              if(event.code=='Enter'){
                sendMessage();
                setMessageContent('')
              }
            }}
          />
          <button className={`ml-3 ${lighttheme?'bg-gray-300':'bg-gray-800'} text-white rounded-full px-3 py-3 font-semibold`}
          onClick={()=>{
            sendMessage();
          }}
          >
            <IoSend />
          </button>
      </div>
    </div>
  )
}

export default ChatArea;
