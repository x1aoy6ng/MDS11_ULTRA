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
    <div className="d-flex flex-column align-items-center" style={{ minHeight: '70vh' }}>
      <div
        className="shadow p-4 bg-white rounded d-flex flex-column align-items-center"
        style={{ width: 650 }}
      >
        <h3 className="mb-4">Transcribe a local / an online file</h3>
        <button
          className="btn btn-outline-primary mb-3"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload File
        </button>
        <input
          type="file"
          accept="audio/*,video/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <div className="w-100 text-center my-2">or</div>
        <form className="w-100" onSubmit={handleYoutubeSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Input YouTube URL"
            value={youtubeLink}
            onChange={e => setYoutubeLink(e.target.value)}
          />
          <button type="submit" className="btn btn-success w-100">
            Transcribe
          </button>
        </form>
      </div>

      {/* Recently Processed Files Table */}
      <div className="mt-5" style={{ width: 700 }}>
        <h5 className="mb-3">Recently Processed Files</h5>
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>File Name & Date</th>
              <th>File Size</th>
              <th>File Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentFiles.map((file, idx) => (
              <tr key={idx}>
                <td>
                  <div>{file.name}</div>
                  <small className="text-muted">{file.date}</small>
                </td>
                <td>{file.size}</td>
                <td>{file.duration}</td>
                <td>
                  <span className={`badge ${file.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {file.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" disabled={file.status !== 'Completed'}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Main;