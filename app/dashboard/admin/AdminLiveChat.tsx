'use client';

import {fetchMessages, messageFn} from '@/lib/actions/livechat.actions';
import {client} from '@/lib/apwriteclient';
import {RootState} from '@/redux/store';
import {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

export interface MessageProps {
  message: string;
  sender: string;
  $createdAt: any;
}

const DateTimeFn = (timestamp: any) => {
  if (!timestamp || typeof timestamp !== 'string') {
    return {date: 'Invalid date', time: 'Invalid time', fullDate: null, isToday: false};
  }

  const dateObj = new Date(timestamp);
  if (isNaN(dateObj.getTime())) {
    return {date: 'Invalid date', time: 'Invalid time', fullDate: null, isToday: false};
  }

  const today = new Date();
  const isToday =
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear();

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

  return {date, time, fullDate: dateObj, isToday};
};

const AdminLiveChat = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for last message

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
          `databases.${DATABASE_ID}.collections.${LIVECHAT_COLLECTION_ID}.documents`,
          (response) => {
            if (
              response.events.includes(
                `databases.${DATABASE_ID}.collections.${LIVECHAT_COLLECTION_ID}.documents.*.create`
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

  // Auto-scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const submitMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user) return;

    try {
      await messageFn({message: newMessage, sender: user.$id});
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const groupedMessages: {[key: string]: MessageProps[]} = messages.reduce((acc, msg) => {
    const {date, isToday} = DateTimeFn(msg.$createdAt);
    const groupKey = isToday ? 'Today' : date;

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(msg);
    return acc;
  }, {} as {[key: string]: MessageProps[]});

  return (
    <div className="p-4 w-[21rem]">
      <h1 className="text-lg font-bold text-white">Client Live Chat</h1>
      <ul className="mb-4 bg-slate-100 p-4 rounded-lg shadow-md h-96 overflow-y-auto max-w-[24rem]">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <span className="flex justify-center font-bold my-2 text-[10px]">{date}</span>
            {msgs.map((msg, index) => (
              <li
                key={index}
                className={`my-2 flex ${
                  msg.sender === 'client' ? 'justify-start ' : 'justify-end'
                }`}>
                <div
                  className={`py-1 px-2 rounded-xl max-w-[14rem] ${
                    msg.sender === 'client'
                      ? 'bg-gray-600 text-white '
                      : '  bg-green-600 text-white'
                  }`}>
                  <span className="flex-wrap gap-1">
                    <span className="text-sm mr-1.5">{msg.message}</span>
                    <span className="text-[7px]">{DateTimeFn(msg.$createdAt).time}</span>
                  </span>
                </div>
              </li>
            ))}
          </div>
        ))}
        {/* Empty div for auto-scroll */}
        <div ref={messagesEndRef} />
      </ul>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="border rounded-full p-2 w-full"
        />
        <button onClick={submitMessage} className="bg-blue-700 text-white p-2  rounded-full">
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminLiveChat;
