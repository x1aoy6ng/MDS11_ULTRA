import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from './button';

const Main: React.FC = () => {  
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [history, setHistory] = useState<any[]>([]); // to store recent files

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
      status: 'Failed',
    },
  ];

  // validate the youtube url
  const isValidYoutubeLink = (url: string): boolean => {
    if (!url.trim()) return true; // empty url is valid
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]+/;
    return youtubeRegex.test(url)
  }

  // return file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 bytes'
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + ' ' + sizes[i]; 
  }

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // check whether user input youtube link
    if (!youtubeLink.trim()){
      alert('Please enter a youtube link'); // for debug
      return;
    }

    // check whether the youtube link is valid
    if (!isValidYoutubeLink(youtubeLink)){
      // pop a dialog showing invalid youtube link
      alert('Please enter a valid youtube link');   // for debug
      return;
    }


    if (youtubeLink.trim()) {
      // Handle YouTube link logic here
      alert(`YouTube link submitted: ${youtubeLink}`);    // for debug
      navigate('/transcript', {
        state: {
          youtubeUrl: youtubeLink.trim(),
          audioFile: null, // to update, audio need to be extracted from video
          fileName: 'Youtube Video',
          fileSize: 'N/A',
          timeStamp: new Date().toISOString(),
          source: 'youtube_url'
        }
      });
    }
  };

  // triggered when user upload a file
  const handleFileUpload = async(event: React.ChangeEvent<HTMLInputElement>) => { 
    // event.target.files is a FileList object
    const file = event.target.files?.[0];

    if (!file) return; // no file selected

    setUploadedFile(file); // store the uploaded file (locally)

    // build the form data to send to backend
    const formData = new FormData();
    formData.append('file', file);

    fetchHistory(); // refresh the recent files

    try {
      // send the file to backend
      const response = await fetch('http://localhost:5000/upload', { //fetch return a Promise
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('File uploaded successfully:', data);

      // navigate to transcript screen with the uploaded file info
      navigate('/transcript', {
        state: {
          youtubeUrl: youtubeLink.trim() || null,
          audioFile: file,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          timeStamp: new Date().toISOString(),
          source: 'file_upload'
        }
      }); 

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file'); // for debug
    }
  };

  // handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // prevent opening the file in browser
  };

  const handleDrop = async(e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    
    if (!file || !(file.type.startsWith("audio/") || file.type.startsWith("video/"))) {
      alert("Please drop a valid audio/video file");
      return;
    }

    setUploadedFile(file);

    // build the form data to send to backend
    const formData = new FormData();
    formData.append('file', file);

    fetchHistory(); // refresh history

    try {
      // send the file to backend
      const response = await fetch('http://localhost:5000/upload', { //fetch return a Promise
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('File uploaded successfully via drag-drop:', data);

      // navigate to transcript screen with the uploaded file info
      navigate('/transcript', {
        state: {
          youtubeUrl: youtubeLink.trim() || null,
          audioFile: file,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          timeStamp: new Date().toISOString(),
          source: 'file_drop'
        }
      }); 
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file'); // for debug
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []); // Empty dependency array ensures it runs only once when the component mounts.

  // handle clicking on recent files - navigate to transcript
  const handleRecentFileCheck = (file: any) => {
    navigate('/transcript', {
      state: {
        youtubeUrl: null,
        audioFile: null,
        fileName: file.fileName,
        fileSize: file.size || 'N/A',
        timestamp: file.uploadDate,
        source: 'recent_file'
      }
    });
  };

  const handleDownload = () => {
    // Implement download logic here
    alert('Download functionality is not implemented yet.'); // for debug
  }
  
  const handleDelete = () => {
    // Implement delete logic here
    alert('Delete functionality is not implemented yet.'); // for debug
  }

  return (
    // main container
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
          onDragOver={handleDragOver}
          onDrop={handleDrop}
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

        <p className="mt-3 pl-2 text-xs text-gray-400">
          Supported formats: MP3, WAV, MP4, M4A, MOV, AVI.
        </p>
        
        {/* Divider with "OR" */}
        <div className="flex items-center pt-2 pb-5">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-400 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        {/* YouTube link input and Transcribe button*/}
        <form className="flex space-x-2" onSubmit={handleYoutubeSubmit}>
          <div className="flex items-center border-2 border-dashed border-blue-400 rounded-xl px-3 flex-grow placeholder-gray-500">
            <input
            type="text"
            className="flex-grow p-2 outline-none"
            placeholder="Input YouTube URL ..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            />
          </div>
          {/* Download button */}
          <IconButton
            icon={null}
            ariaLabel="Download"
            disabled = {!youtubeLink.trim() || !isValidYoutubeLink(youtubeLink)}
            onClick={() => navigate('/transcript')}     // TO UPDATE
          >
            Transcribe
          </IconButton>
        </form>

      {/* Youtube URL validation message */}
      {youtubeLink.trim() && !isValidYoutubeLink(youtubeLink) && (
        <div className='mt-2 text-red-500 text-sm flex items-center'>
          <span className="material-symbols-rounded text-base mr-1">error</span>
          Please enter a valid Youtube URL
        </div>
      )}
      </div>

      {/* Recently Processed Files Section */}
      <div className="bg-white shadow rounded-2xl p-6 mt-10 w-full max-w-2xl">
      {/* Title for recent files */}
      <div className='flex items-center space-x-2 mb-4'>
        <div
          className='flex items-center justify-center w-8 h-8 rounded-full bg-[#E8E8E8] dark:bg-[#2F2E32] cursor-pointer'
          >
          <span className="material-symbols-rounded text-xl text-primary dark:text-primary-dark">history</span>
        </div>
        <h3 className="text-lg font-medium">Recently processed files</h3>
      </div>


      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm rounded-sm">
          {/* Table header */}
          <thead className="bg-[#F3F2F2] dark:bg-[#46444B]">
            <tr>
              <th className="px-4 py-3 text-[#787878] dark:text-[#DADADA]">File Name & Date</th>
              <th className="px-4 py-3 text-[#787878] dark:text-[#DADADA]">File Size</th>
              <th className="px-4 py-3 text-[#787878] dark:text-[#DADADA]">File Duration</th>
              <th className="px-4 py-3 text-[#787878] dark:text-[#DADADA]">Status</th>
              <th className="px-4 py-3 text-[#787878] dark:text-[#DADADA]">Actions</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
              {history.map((file, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition-colors duration-150">

                  {/* File name and date */}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRecentFileCheck(file)}
                      className='text-left hover:text-primary transition-colors'
                    >
                      <div className='dark:text-[#CECDCD]'>{file.fileName}</div>
                      <small className="text-[#CDCBCB]">{new Date(file.uploadDate).toLocaleString()}</small>
                    </button>
                  </td>

                  {/* File size, duration, status, and actions */}
                  <td className="px-4 py-3 dark:text-[#CECDCD]">{file.size}</td>
                  <td className="px-4 py-3 dark:text-[#CECDCD]">{file.duration}</td>
                  <td className="px-4 py-3 dark:text-[#CECDCD]">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      file.status === "Completed" 
                        ? 'bg-green-100 text-green-700'
                        : file.status === "Failed"
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {/* Download button */}
                      <button
                        onClick={handleDownload}
                        className="text-blue-500 hover:text-blue-700 transition"
                        aria-label="Download"
                      >
                        <span className="py-1 material-symbols-outlined">download</span>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 transition"
                        aria-label="Delete"
                      >
                        <span className="py-1 material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>  
        </div>

        {history.length === 0 &&(
          <div className = "flex items-center space-x-2 pt-2">
            <span className="material-symbols-rounded text-3xl">folder_open</span>
            <p>No recent file found</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Main;