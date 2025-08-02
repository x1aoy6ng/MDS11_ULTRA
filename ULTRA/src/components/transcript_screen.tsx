import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from './button';

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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div
        className="position-relative shadow p-4 bg-white rounded-4"
        style={{ width: 1300, minHeight: 550 }}
      >
        {/* Top right controls */}
        <div className="position-absolute d-flex gap-2" style={{ top: 16, right: 16 }}>
          {/* Translate button */}
          <IconButton 
            icon={<span className="material-symbols-rounded">translate</span>}
            ariaLabel="Translate"
            onClick={() => navigate('/translate')}
          >
            Translate
          </IconButton>
          
          {/* Download button */}
          <IconButton
            icon={<span className="material-symbols-rounded">download</span>}
            ariaLabel="Download"
            onClick={handleDownload}
          >
            Download
          </IconButton>
          
          {/* Close button */}
          <IconButton
            icon={<span className="material-symbols-rounded">close</span>}
            ariaLabel="Close"
            circle
            onClick={() => navigate('/')}
          />
        </div>

        <h1 className="mb-4 text-secondary">Transcribe</h1>

        <div style={{ minHeight: 200 }}>
          <p>Transcription text....</p>
        </div>
      </div>
    </div>
  );
};

export default Transcript;