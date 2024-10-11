// MessageSelf.jsx
import React from 'react';

const MessageSelf = ({ text, time }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-xs px-4 py-2 text-white bg-blue-500 rounded-lg">
        <p className="text-sm">{text}</p>
        <p className="text-xs text-gray-300">{time}</p>
      </div>
    </div>
  );
};

export default MessageSelf;