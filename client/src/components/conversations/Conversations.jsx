import React, { useState, useEffect } from "react";
import axios from "axios";
import "./conversations.css";

// conversation
export default function Conversations(props) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = props.conversation.members.find(
      (m) => m !== props.currentUser._id
    );
    const getUser = async () => {
      try {
        const res = await axios("/users?userId=" + friendId);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [props.currentUser, props.conversation]);

  return (
    <div className="conversation">
      <img
         src={
          user?.profilePicture
            ? PF + user?.profilePicture
            : PF + "person/noAvatar.png"
        }
        className="conversationImage"
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
