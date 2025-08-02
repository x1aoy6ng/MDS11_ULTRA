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
    <div className="flex justify-center items-center bg-gray-50 p-8">
      <div className='relative shadow-lg p-4 bg-white rounded-xl w-full max-w-7xl min-h-[600px]'>
        {/* close button at top right corner */}
        <div className='absolute -top-4 -right-4'>
          {/* Close button */}
          <IconButton
            icon={<span className="material-symbols-rounded">close</span>}
            ariaLabel="Close"
            circle
            onClick={() => navigate('/')}
          />
        </div>

        {/* main content */}
        <div className="max-w-6xl mx-auto">
          {/* title */}
          <div className='flex items-center justify-between gap-4 mb-6'>
            <h1 className='mt-4 text-4xl font-semibold text-[#585858]'>Transcribe</h1>
            
            <div className='mt-4 flex items-center justify-center gap-3'>
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
            </div>
          </div>

          <div className='border-t border-gray-200'>
            {/* TODO: two section */}
            {/* TODO: file details, video audio */}
            {/* TODO: transcribed text */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcript;