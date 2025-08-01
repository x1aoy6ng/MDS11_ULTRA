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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div
        className="position-relative shadow p-4 bg-white rounded"
        style={{ width: 600, minHeight: 350 }}
      >
        {/* Top right controls */}
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/translate')}
            title="Translate"
          >
            Translate
          </button>
          <button
            className="btn btn-outline-success"
            onClick={handleDownload}
            title="Download"
          >
            Download
          </button>
          <button
            className="btn btn-close ms-2"
            aria-label="Close"
            onClick={() => navigate('/')}
            title="Close"
          />
        </div>
        <h2 className="mb-4">Transcription</h2>
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