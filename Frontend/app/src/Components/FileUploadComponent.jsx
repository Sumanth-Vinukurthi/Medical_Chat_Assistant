import React, { useState } from 'react';

const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUpload = () => {
    if (file && title) {
      console.log('File uploaded:', file);
      console.log('File title:', title);
      // Handle file upload logic here
    } else {
      alert('Please provide both a title and a file.');
    }
  };

  return (
    <div className="file-upload">
      <input 
        type="text" 
        placeholder="Document Title" 
        value={title} 
        onChange={handleTitleChange}
      />
      <input 
        type="file" 
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUploadComponent;
