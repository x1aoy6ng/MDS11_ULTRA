import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {  
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [youtubeLink, setYoutubeLink] = useState('');

  // Example data for recently processed files
  const recentFiles = [
    {
      name: 'meeting_audio.mp3',
      date: '2025-07-23 10:15',
      size: '3.2 MB',
      duration: '00:02:15',
      status: 'Completed',
    },
    {
      name: 'lecture_video.mp4',
      date: '2025-07-22 16:40',
      size: '15.8 MB',
      duration: '00:10:05',
      status: 'Processing',
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      alert(`File uploaded: ${file.name}`);
      // navigate('/transcript'); // Uncomment to go to transcript after upload
    }
  };

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeLink.trim()) {
      // Handle YouTube link logic here
      alert(`YouTube link submitted: ${youtubeLink}`);
      navigate('/transcript');
    }
  };

  return (
    // main container， can make it 50 blue 50 white also
    <div className="min-h-screen flex flex-col items-center p-6">
      {/*upload section*/}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
        {/* Title */}
        <div className="flex items-center space-x-3 mb-6">
          {/* Green background icon container */}
          <div className='bg-green-200 p-2 rounded-full'>
            <span className="material-symbols-rounded flex items-center justify-center h-6 w-6 text-green-700">cloud_upload</span>
          </div>
          <h2 className="text-lg font-semibold">
            Transcribe a local / an online file
          </h2>
        </div>

        {/* Drag-and-drop upload area */}
        <div
          onClick={() => fileInputRef.current?.click()} // Clicking the box opens file picker
          className="border-2 border-dashed border-blue-400 rounded-xl p-10 text-center text-gray-500 cursor-pointer hover:bg-blue-50 transition"
        >
          Click to upload or drag and drop your file here
          {/* Hidden actual file input */}
          <input
          type="file"
          accept="audio/*,video/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          />
        </div>
        
        {/* Divider with "OR" */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        {/* YouTube link input and Transcribe button*/}
        <form className="flex space-x-2" onSubmit={handleYoutubeSubmit}>

          <div className="flex items-center border-2 border-dashed border-blue-400 rounded-xl px-3 flex-grow">
            <input
            type="text"
            className="flex-grow p-2 outline-none"
            placeholder="Input YouTube URL ..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 rounded-xl hover:from-blue-800 hover:to-blue-600 transition"
          >
            Transcribe
          </button>
        </form>
      </div>

      {/* Recently Processed Files Section */}
      <div className="bg-white shadow rounded-2xl p-4 mt-10 w-full max-w-3xl">
      {/* Title for recent files */}
        <h3 className="flex items-center space-x-2 text-lg font-medium mb-4">
          <span>Recently processed files</span>
        </h3>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            {/* Table header */}
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">File Name & Date</th>
                <th className="px-4 py-2">File Size</th>
                <th className="px-4 py-2">File Duration</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            {/* Table body */}
            <tbody>
              {recentFiles.map((file, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">

                  {/* File name and date */}
                  <td className="px-4 py-3">
                    <div>{file.name}</div>
                    <small className="text-gray-500">{file.date}</small>
                  </td>

                  {/* File size, duration, status, and actions */}
                  <td className="px-4 py-3">{file.size}</td>
                  <td className="px-4 py-3">{file.duration}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      {file.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-500 hover:underline text-sm">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>  
        </div>
      </div>
    </div>
  );
};

export default Main;