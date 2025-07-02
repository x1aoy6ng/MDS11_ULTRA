import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Main Screen</h1>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/transcript')}>
        Transcribe
      </button>
    </div>
  );
};

export default Main;