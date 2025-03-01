'use server';

import {ID} from 'node-appwrite';
import {createAdminClient} from '../appwrite';
import {parseStringify} from '../utils';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const LIVECHAT_COLLECTION_ID = process.env.APPWRITE_LIVECHAT_COLLECTION_ID!;

interface MessageProps {
  message: string;
  sender: string;
  timestamp?: string;
}

export const messageFn = async ({message, sender}: MessageProps) => {
  const {database} = await createAdminClient();

  try {
    const response = await database.createDocument(
      DATABASE_ID!,
      LIVECHAT_COLLECTION_ID!,
      ID.unique(), // Unique ID
      {
        message,
        sender,
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const fetchMessages = async () => {
  try {
    const {database} = await createAdminClient();

    const response = await database.listDocuments(DATABASE_ID!, LIVECHAT_COLLECTION_ID!);

    const messages = response.documents.map((doc: any) => ({
      message: doc.message,
      sender: doc.sender,
      $createdAt: doc.$createdAt,
    }));

    return parseStringify(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};
