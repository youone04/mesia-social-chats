import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./chatOnline.css";

export default function ChatOnline(props) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + props?.currentId);
      setFriends(res.data);
    };

    getFriends();
  }, [props.currentId]);

  useEffect(() => {
    setOnlineFriends(
      friends.filter((f) => props?.onlineUsers.includes(f?._id))
    );
  }, [friends, props?.onlineUsers]);

  const handleClick = async(user) => {
    try{

      const res = await axios.get(`/conversations/find/${props.currentId}/${user._id}`);
      props.setCurrentChat(res.data)

    }catch(error){
      console.log(error);
    }

  }

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={o.profilePicture
                ? PF + o.profilePicture
                : PF + "person/noAvatar.png"}
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o.username}</span>
        </div>
      ))}
    </div>
  );
}
