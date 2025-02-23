'use server';

import {Account, Client, ID, Storage} from 'appwrite';

export async function createStorageClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  return {
    get storage() {
      return new Storage(client);
    },
    get account() {
      return new Account(client);
    },
  };
}

export async function ImageUploader(file: File) {
  try {
    const {storage} = await createStorageClient();

    // Upload the file to Appwrite's storage
    const response = await storage.createFile(
      process.env.APPWRITE_IMAGE_BUCKET_ID!,
      ID.unique(),
      file
    );

    const imageUrl = storage.getFilePreview(process.env.APPWRITE_IMAGE_BUCKET_ID!, response.$id);

    return imageUrl;
  } catch (error: any) {
    console.error('Upload failed:', error.message || error);
    throw error;
  }
}
