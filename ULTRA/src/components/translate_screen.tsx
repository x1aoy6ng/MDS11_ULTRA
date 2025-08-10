import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from './button';
import { KELANTAN_DICTIONARY } from '../dictionary/kelantan';
import { SARAWAK_DICTIONARY } from '../dictionary/sarawak';

const TranslateScreen: React.FC = () => {
  const navigate = useNavigate();
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('Malay');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 5000

  // detect language
  const detectLanguage = (text:string): string => {
    if (!text.trim()) return '';

    // detect based on common words in dictionary
    const kelantaneseWord = Object.keys(KELANTAN_DICTIONARY);
    const sarawakianWord = Object.keys(SARAWAK_DICTIONARY);
    const lowerText = text.toLowerCase();

    if (kelantaneseWord.some(word => lowerText.includes(word.toLowerCase()))){
      return "Kelantanese Malay"
    }
    else if (sarawakianWord.some(word => lowerText.includes(word.toLowerCase()))){
      return "Sarawakian Malay"
    }
    return "Detect language";
  }

  // translate function
  const translateText = (text: string, targetLang: string): string => {
    if (!text.trim()) return '';

    // TODO

    return translatedText
  }

  // source text change
  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxCharCount){
      setSourceText(text);
      setCharCount(text.length)

      // detect the language
      const detectedLang = detectLanguage(text)
      setSourceLang(detectedLang)

      // auto translate
      if (text.trim()){
        const translation = translateText(text, targetLang);
        setTranslatedText(translation);
      } else {
        setTranslatedText('');
      }
    }
  };

  // download the file
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/transcript.txt';
    link.download = 'transcript.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // copy text
  const HandleCopy = () => {
    if (translatedText){
      navigator.clipboard.writeText(translatedText);
    }
  };

  return (
    <div className='flex justify-center items-center p-8'>
      <div className="relative shadow-lg p-4 bg-white dark:bg-[#222222] rounded-xl w-full max-w-7xl min-h-[670px]">
        {/* put close button at the top right corner */}
        <div className='absolute -top-4 -right-4'>
          <IconButton
            icon={<span className="material-symbols-rounded dark:text-white">close</span>}
            ariaLabel="Close"
            circle
            onClick={() => navigate('/')}
          />
        </div>
        
        {/* main content */}
        <div className='max-w-6xl mx-auto'>
          {/* title */}
          <div className='flex items-center justify-between mb-6'>
            <h1 className='mt-4 text-4xl font-semibold  text-[#585858] dark:text-[#F2F2F2]'>Translate</h1>

            <div className='mt-4 flex items-center justify-center gap-3'>
              {/* download button */}
              <IconButton
                icon={<span className="material-symbols-rounded">download</span>}
                ariaLabel="Download"
                onClick={handleDownload}
              >
                Download
              </IconButton>
            </div>
          </div>

          <div className='border-t border-gray-200 dark:border-[#5E5E5E]'>
            <div className='grid grid-cols-1 lg:grid-cols-[2fr_auto_2fr] gap-2 mt-6 ml-2 mr-2'>
              
              {/* 1. toggles + translation box */}
              <div className='flex flex-col'>
                {/* dialect toggles */}
                <div className='flex gap-4 mb-4'>
                  <button
                    className={`transition-colors ${sourceLang === 'Kelantanese Malay'? 'text-primary border-b-2 border-primary dark:text-primary-dark dark:border-primary-dark' : 'text-[#585858] hover:text-[#55A2FB] dark:text-[#F2F2F2] dark:hover:text-[#B2B2B2]'}`}
                    onClick={() => setSourceLang('Kelantanese Malay')}  
                  >
                    Kelantanese Malay
                  </button>

                  <button
                    className={`transition-colors ${sourceLang === 'Sarawakian Malay'? 'text-primary border-b-2 border-primary dark:text-primary-dark dark:border-primary-dark': 'text-[#585858] hover:text-[#55A2FB] dark:text-[#F2F2F2] dark:hover:text-[#B2B2B2]'}`}
                    onClick={() => setSourceLang('Sarawakian Malay')}  
                  >
                    Sarawakian Malay
                  </button>
                </div>

                {/* box with transcription */}
                <div className='bg-container-light dark:bg-container-dark rounded-md shadow-sm p-6 mb-2'>
                  <textarea
                    className='bg-container-light dark:bg-container-dark w-full h-80 resize-none border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 text-lg'
                    style={{fontSize: '16px'}}
                    value={sourceText}
                    onChange={handleSourceTextChange}
                    placeholder=''
                  />
                  <div className='flex items-center justify-end mt-4 pt-4 '>
                    <div className='flex items-end gap-3 text-primary dark:text-primary-dark text-sm' style={{fontSize: '15px'}}>
                      <span>{charCount}/{maxCharCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. swap icon */}
              <div className='flex items-center justify-center px-4'>
                <button 
                  className='inline-flex justify-center items-center rounded-full bg-white dark:bg-[#404040] border border-gray-200 dark:border-[#5c5c5c] shadow-sm transition-all duration-200 text-[#585858] dark:text-white cursor-default'
                  style={{width:40, height:30, padding:0}}
                >
                  <span className="material-symbols-rounded">swap_horiz</span>
                </button>
              </div>

              {/* 3. standard language toggles + transcription box */}
              <div className='flex flex-col'>
                {/* target language */}
                <div className='flex gap-4 mb-4'>
                  <button
                    className={`transition-colors ${targetLang === 'Malay'? 'text-primary dark:text-primary-dark border-b-2 border-primary dark:border-primary-dark': 'text-[#585858] hover:text-[#55A2FB] dark:text-[#F2F2F2] dark:hover:text-[#B2B2B2]'}`}
                    onClick={() => setTargetLang('Malay')}  
                  >
                    Malay
                  </button>

                  <button
                    className={`transition-colors ${targetLang === 'English'? 'text-primary dark:text-primary-dark border-b-2 border-primary dark:border-primary-dark': 'text-[#585858] hover:text-[#55A2FB] dark:text-[#F2F2F2] dark:hover:text-[#B2B2B2]'}`}
                    onClick={() => setTargetLang('English')}  
                  >
                    English
                  </button>
                </div>

                {/* translation box */}
                <div className='bg-container_segment-light dark:bg-container_segment-dark rounded-md shadow-sm p-6 mb-2'>
                  <div className='w-full h-80 text-gray-600 text-lg overflow-y-auto'>
                    {translatedText || <span className='text-gray-400'>Translation</span>}
                  </div>
                  <div className='flex items-center justify-end mt-4 pt-4 mr-2'>
                    <button className='text-primary dark:text-primary-dark' onClick={HandleCopy}>
                      <span className="material-symbols-rounded" style={{fontSize: '20px'}}>content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default TranslateScreen;