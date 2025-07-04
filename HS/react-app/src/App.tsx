import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./components/main_screen";
import Header from './components/header';
import TranscriptScreen from './components/transcript_screen';
import TranslateScreen from './components/translate_screen';

function App() {
  return (
    <Router>
      <Header />
      <div style={{ marginTop: '90px' }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/transcript" element={<TranscriptScreen />} />
          <Route path="/translate" element={<TranslateScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;