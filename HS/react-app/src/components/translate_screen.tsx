import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TranslateScreen: React.FC = () => {
  const navigate = useNavigate();
  const [sourceLang, setSourceLang] = useState('Detected: English');
  const [targetLang, setTargetLang] = useState('Malay');
  const [sourceText, setSourceText] = useState('This is the original text.');
  const [translatedText, setTranslatedText] = useState('Ini adalah teks asal.');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/translation.txt';
    link.download = 'translation.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div
        className="position-relative shadow p-4 bg-white rounded"
        style={{ width: 700, minHeight: 400 }}
      >
        {/* Top right controls */}
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '8px' }}>
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
        {/* Language selection - moved below top controls */}
        <div style={{ height: 48 }} /> {/* Spacer to push language selection below buttons */}
        <div className="d-flex justify-content-between mb-3" style={{ gap: '16px' }}>
          <div>
            <button className="btn btn-outline-secondary me-2" disabled>
              {sourceLang}
            </button>
          </div>
          <div>
            <button
              className={`btn btn-outline-primary me-2${targetLang === 'Malay' ? ' active' : ''}`}
              onClick={() => setTargetLang('Malay')}
            >
              Malay
            </button>
            <button
              className={`btn btn-outline-primary${targetLang === 'English' ? ' active' : ''}`}
              onClick={() => setTargetLang('English')}
            >
              English
            </button>
          </div>
        </div>
        {/* Text bubbles */}
        <div className="d-flex justify-content-between" style={{ gap: '16px' }}>
          <div
            className="p-3 bg-light rounded shadow-sm flex-fill"
            style={{ minHeight: 150, width: '48%' }}
          >
            <textarea
              className="form-control border-0 bg-transparent"
              style={{ minHeight: 100, resize: 'none' }}
              onChange={e => setSourceText(e.target.value)}
              placeholder="Original text"
            />
          </div>
          <div
            className="p-3 bg-light rounded shadow-sm flex-fill"
            style={{ minHeight: 150, width: '48%' }}
          >
            <textarea
              className="form-control border-0 bg-transparent"
              style={{ minHeight: 100, resize: 'none' }}
              onChange={e => setTranslatedText(e.target.value)}
              placeholder="Translated text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslateScreen;