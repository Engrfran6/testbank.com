'use client';

import {Client, Databases, ID, Query} from 'appwrite';
import {useEffect, useState} from 'react';

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const chatRoomId = 'visitor'; // Define chat room ID for visitors

  const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_LIVECHAT_COLLECTION_ID: LIVECHAT_COLLECTION_ID,
  } = process.env;

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const database = new Databases(client);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await database.listDocuments(DATABASE_ID!, LIVECHAT_COLLECTION_ID!, [
          Query.equal('chatRoomId', [chatRoomId]),
        ]);
        setMessages(response.documents);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Real-time subscription to listen for new messages
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${LIVECHAT_COLLECTION_ID!}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          setMessages((prev) => [...prev, response.payload]);
        }
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await database.createDocument(DATABASE_ID!, LIVECHAT_COLLECTION_ID!, ID.unique(), {
        chatRoomId,
        senderId: 'visitor',
        message,
        timestamp: new Date().toISOString(),
      });

      setMessage(''); // Clear input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.senderId === 'visitor' ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-60 h-20 ml-10"
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* <AdminChat chatRoomId={chatRoomId} /> */}
    </div>
  );
};

export default Chat;
