import React from 'react';
import { format } from "timeago.js";
import "./message.css";

export default function Message(props) {
  return (
    <div className={props.own?'message own':'message'}>
        <div className='messageTop'>
            <img src='https://apkvision.com/wp-content/uploads/2020/09/unnamed-1-47.png' alt='' className='messageImage' />
            <p className='messageText'>{props.message?.text}</p>
        </div>
        <div className='messageBottom'>
           {format(props.message?.createdAt)}
        </div>
    </div>
  )
}
