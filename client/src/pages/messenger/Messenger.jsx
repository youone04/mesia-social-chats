import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Conversations from "../../components/conversations/Conversations";
import Message from "../../components/message/Message";
import Topbar from "../../components/topbar/Topbar";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "./messenger.css";
import { useRef } from "react";
import { io } from "socket.io-client";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef(io("ws://localhost:8900"));
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      })
    })

  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages(prev => [...prev, arrivalMessage])

  }, [arrivalMessage, currentChat])

  useEffect(() => {
    socket.current.emit("addUser", user?._id);
    socket.current.on("getUsers", users => {
      setOnlineUsers(user.followings.filter(f => users.some(u => u.userId === f)))
    });

    // return () => {
    //   socket.current.off("getUsers", handleGetUsers);
    // };

  }, [user?._id]);

  // const handleGetUsers = (users) => {
  //   setOnlineUsers(user.followings.filter(f => users.some(u => u.userId === f)));
  // };

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages()
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id
    }
    const receiverId = currentChat?.members?.find(member => member !== user?._id)
    const cekOnlineUser = onlineUsers.find(user => user === receiverId)

    try {

      cekOnlineUser && socket.current.emit("sendMessage", {
        senderId: user?._id,
        receiverId,
        text: newMessage
      })

      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])



  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations?.map((c, i) => (
              <div key={i} onClick={() => setCurrentChat(c)}>
                <Conversations conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {
                    messages.map((m, i) => (
                      <div key={i} ref={scrollRef}>
                        <Message message={m} own={m.sender === user._id} />
                      </div>
                    ))
                  }

                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="wwrite something"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button onClick={handleSubmit} className="chatSubmitButton">Send</button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatWrapperOnline">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user?._id}
              setCurrentChat={setCurrentChat} />
          </div>
        </div>
      </div>
    </>
  );
}
