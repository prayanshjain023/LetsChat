// MessageOther.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const MessageOther = ({ text, time }) => {
  const lighttheme = useSelector((state)=>state.themekey)
  return (
    <div className="flex justify-start">
      <div className={`max-w-xs px-4 py-2 ${lighttheme ? 'bg-gray-200' : 'bg-zinc-900'} rounded-lg`}>
        <p className="text-sm">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default MessageOther;