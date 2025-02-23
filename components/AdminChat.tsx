'use client';

import {Client, Databases, Query} from 'appwrite';
import {useEffect, useState} from 'react';

const AdminChat = ({chatRoomId}: {chatRoomId: string}) => {
  const [messages, setMessages] = useState<any>([]);
  const [reply, setReply] = useState('');

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
      const response = await database.listDocuments(DATABASE_ID!, LIVECHAT_COLLECTION_ID!, [
        Query.equal('chatRoomId', [chatRoomId]),
      ]);
      setMessages(response.documents);
    };

    fetchMessages();
  }, [chatRoomId]);

  const sendReply = async () => {
    if (!reply.trim()) return;

    await database.createDocument(DATABASE_ID!, LIVECHAT_COLLECTION_ID!, 'unique()', {
      chatRoomId,
      senderId: 'admin', // Admin identifier
      message: reply,
      timestamp: new Date().toISOString(),
    });

    setReply('');
  };

  return (
    <div className="admin-chat-container">
      <div className="chat-messages">
        {messages.map((msg: any, index: number) => (
          <div key={index} className={`message ${msg.senderId === 'admin' ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type a reply..."
        />
        <button onClick={sendReply}>Reply</button>
      </div>
    </div>
  );
};

export default AdminChat;
