
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ChatInterface } from './components/ChatInterface';
import { Spinner } from './components/Spinner';
import { extractTextFromPdf } from './services/pdfProcessor';
import { getAnswerFromDocument } from './services/geminiService';
import { QAPair } from './types';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [processingFile, setProcessingFile] = useState<boolean>(false);
  const [qaHistory, setQaHistory] = useState<QAPair[]>([]);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setProcessingFile(true);
    setError(null);
    setExtractedText(null);
    setQaHistory([]);

    try {
      const text = await extractTextFromPdf(selectedFile);
      setExtractedText(text);
    } catch (err) {
      setError("Failed to process the PDF file. It might be corrupted or in an unsupported format. Please try another file.");
      console.error(err);
    } finally {
      setProcessingFile(false);
    }
  }, []);

  const handleAskQuestion = useCallback(async (question: string) => {
    if (!extractedText || !question.trim()) return;

    setIsLoadingAnswer(true);
    setError(null);

    const newQAPair: QAPair = { question, answer: '' };
    setQaHistory(prev => [...prev, newQAPair]);

    try {
      const answer = await getAnswerFromDocument(extractedText, question);
      setQaHistory(prev => prev.map(qa => qa === newQAPair ? { ...qa, answer } : qa));
    } catch (err) {
      const errorMessage = "Sorry, an error occurred while generating the answer. Please try again.";
      setError(errorMessage);
      setQaHistory(prev => prev.map(qa => qa === newQAPair ? { ...qa, answer: errorMessage, isError: true } : qa));
      console.error(err);
    } finally {
      setIsLoadingAnswer(false);
    }
  }, [extractedText]);

  const handleReset = () => {
    setFile(null);
    setFileName('');
    setExtractedText(null);
    setQaHistory([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <header className="w-full p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            DocuQuery AI <span className="text-xs text-gray-500 font-normal ml-2">v1.1</span>
          </h1>
        </div>
        {extractedText && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-semibold bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors duration-200"
          >
            New Document
          </button>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full flex flex-col">
          {!extractedText && !processingFile && !error && (
            <FileUpload onFileSelect={handleFileSelect} />
          )}

          {processingFile && (
            <div className="flex flex-col items-center justify-center h-full">
              <Spinner />
              <p className="mt-4 text-lg text-gray-400">Analyzing your document...</p>
              <p className="text-sm text-gray-500">{fileName}</p>
            </div>
          )}

          {error && !processingFile && (
             <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
                <p className="text-gray-300 mb-6">{error}</p>
                <button
                    onClick={handleReset}
                    className="px-6 py-2 font-semibold bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors duration-200"
                >
                    Try Again
                </button>
            </div>
          )}

          {extractedText && (
            <ChatInterface
              qaHistory={qaHistory}
              onAskQuestion={handleAskQuestion}
              isLoading={isLoadingAnswer}
              fileName={fileName}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
