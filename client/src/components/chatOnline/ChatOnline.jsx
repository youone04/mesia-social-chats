import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import "./chatOnline.css";

export default function ChatOnline(props) {

  const [friends , setFriends] = useState([]);
  const [onlineFriends , setOnlineFriends] = useState([]);

  useEffect(() => {

  },[])

  return (
    <div className='chatOnline'>
        <div className="chatOnlineFriend">
            <div className="chatOnlineImgContainer">
                <img className='chatOnlineImg' src='https://avatarfiles.alphacoders.com/798/79894.jpg' alt=""  />
                <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">
                Yudi Gunawan
            </span>
        </div>
    </div>
  )
}
