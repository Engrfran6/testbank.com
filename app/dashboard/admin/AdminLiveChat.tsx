'use client';

import {fetchMessages, messageFn} from '@/lib/actions/livechat.actions';
import {client} from '@/lib/apwriteclient';
import {RootState} from '@/redux/store';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {MessageProps} from '../client/ClientLiveChat';

const {APPWRITE_DATABASE_ID: DATABASE_ID, APPWRITE_LIVECHAT_COLLECTION_ID: LIVECHAT_COLLECTION_ID} =
  process.env;

const DateTimeFn = (timestamp: any) => {
  if (!timestamp || typeof timestamp !== 'string') {
    return {date: 'Invalid date', time: 'Invalid time', fullDate: null};
  }

  const dateObj = new Date(timestamp);
  if (isNaN(dateObj.getTime())) {
    return {date: 'Invalid date', time: 'Invalid time', fullDate: null};
  }

  const date = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const time = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return {date, time, fullDate: dateObj};
};

const isSameMinute = (messageTime: Date | null) => {
  if (!messageTime) return false; // Handle null case

  const now = new Date();
  return (
    now.getFullYear() === messageTime.getFullYear() &&
    now.getMonth() === messageTime.getMonth() &&
    now.getDate() === messageTime.getDate() &&
    now.getHours() === messageTime.getHours() &&
    now.getMinutes() === messageTime.getMinutes()
  );
};

const AdminLiveChat = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const DATABASE_ID = '6640085f001d1b24644d';
  const LIVECHAT_COLLECTION_ID = '678bbecf000af2de5370';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchPrevMessages = async () => {
      const result = await fetchMessages();
      setMessages(result);
    };

    fetchPrevMessages();

    if (user) {
      try {
        const unsubscribe = client.subscribe(
          `databases.${DATABASE_ID!}.collections.${LIVECHAT_COLLECTION_ID!}.documents`,
          (response) => {
            if (
              response.events.includes(
                `databases.${DATABASE_ID!}.collections.${LIVECHAT_COLLECTION_ID!}.documents.*.create`
              )
            ) {
              setMessages((prev: any) => [...prev, response.payload]);
            }
          }
        );

        return () => {
          unsubscribe(); // Cleanup subscription on unmount
        };
      } catch (error) {
        console.log(error);
      }
    } else return;
  }, [user]);

  console.log('messages=====>', messages);

  const submitMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await messageFn({message: newMessage, sender: 'admin'});
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="border-2 p-4">
      <h1 className="text-lg font-bold">Admin Live Chat</h1>
      <ul className="mb-4 bg-slate-100 p-4 rounded-lg shadow-md h-96 overflow-y-auto max-w-[24rem]">
        {messages.map((msg, index) => {
          const messageTime = DateTimeFn(msg.$createdAt).fullDate;

          return (
            <li
              key={index}
              className={`my-2 flex ${msg.sender === 'client' ? ' justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[17rem] py-1 px-2 rounded-xl ${
                  msg.sender === 'client' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                }`}>
                <span className="flex-wrap gap-1">
                  <span className="font-semibold text-[12px]">
                    {msg.sender === 'client' ? 'You:' : 'Admin:'}
                  </span>
                  <span className="text-sm mr-1.5"> {msg.message}</span>
                  <span className="text-[7px]">
                    {messageTime && isSameMinute(messageTime)
                      ? 'Now'
                      : DateTimeFn(msg.$createdAt).time}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-2 w-full"
        />
        <button onClick={submitMessage} className="bg-green-500 text-white p-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminLiveChat;
