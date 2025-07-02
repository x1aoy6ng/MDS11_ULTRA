import React from 'react';
import { useNavigate } from 'react-router-dom';

const TranslateScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/translation.txt';
    link.download = 'translation.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Translation Screen</h1>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/')}>
        Back to Main
      </button>
      <button className="btn btn-primary mb-3 ms-2" onClick={handleDownload}>
        Download 
      </button>
    </div>
  );
};

export default TranslateScreen;