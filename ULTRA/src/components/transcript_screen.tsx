import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from './icon_button';

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
        className="position-relative shadow p-4 bg-white rounded"
        style={{ width: 600, minHeight: 350 }}
      >
        {/* Top right controls */}
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '8px' }}>
          
          {/* Translate button */}
          <IconButton 
            icon = {<span className="material-symbols-rounded">translate</span>}
            ariaLabel='Translate'
            onClick={() => navigate('/translate')}
          >
            Translate
          </IconButton>
          
          {/* Download button */}
          
          {/* Close button */}
          

        </div>
        <h2 className="mb-4">Transcribe</h2>
        <div style={{ minHeight: 200 }}>
          <p>
            Transcription text....
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transcript;