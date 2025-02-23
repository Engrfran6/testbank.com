'use client';

import {ImageUploader} from '@/lib/actions/image.action';
import React, {useState} from 'react';

const FileUploadComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert('No file selected!');
      return;
    }

    try {
      const response = await ImageUploader(file);

      if (!response) {
        throw new Error('no file uploaded');
      }

      console.log('File uploaded successfully:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input type="file" id="file" onChange={handleFileUpload} disabled={isLoading} />
      {isLoading && <p>Uploading...</p>}
    </div>
  );
};

export default FileUploadComponent;
