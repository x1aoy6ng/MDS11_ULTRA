import React from 'react';
import { useNavigate } from 'react-router-dom';

const Transcript: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/transcript.txt';
    link.download = 'transcript.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Transcription Screen</h1>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/translate')}>
        Translate
      </button>
      <button className="btn btn-primary mb-3 ms-2" onClick={handleDownload}>
        Download
      </button>
    </div>
  );
};

export default Transcript;