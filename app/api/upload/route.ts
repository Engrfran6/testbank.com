import {createStorageClient} from '@/lib/appwrite';
import {NextResponse} from 'next/server';
import {ID} from 'node-appwrite';

const {APPWRITE_IMAGE_BUCKET_ID: IMAGE_ID} = process.env;

export async function POST(req: Request) {
  if (!IMAGE_ID) {
    return NextResponse.json(
      {error: 'APPWRITE_IMAGE_BUCKET_ID is not defined in the environment variables.'},
      {status: 500}
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({error: 'No file provided.'}, {status: 400});
    }

    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the file to Appwrite storage
    const {storage} = await createStorageClient();
    const response = await storage.createFile(IMAGE_ID, ID.unique(), {
      size: buffer,
      filename: file.name,
      type: file.type,
    });

    return NextResponse.json({message: 'File uploaded successfully', data: response});
  } catch (error: any) {
    console.error('File upload failed:', error.message || error);
    return NextResponse.json({error: error.message || 'Upload failed'}, {status: 500});
  }
}
