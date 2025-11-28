
import React, { useCallback, useRef, useState } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(true);
  }, [handleDragEvents]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
  }, [handleDragEvents]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  }, [handleDragEvents, onFileSelect]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEvents}
        onDrop={handleDrop}
        className={`w-full max-w-lg p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-500 bg-gray-800/50 scale-105' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-800/50'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
          <UploadIcon />
          <p className="text-xl font-semibold">Drop your PDF here</p>
          <p>or</p>
          <button
            type="button"
            className="px-6 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Browse Files
          </button>
          <p className="mt-2 text-sm text-gray-500">Maximum file size: 10MB</p>
        </div>
      </div>
      <div className="mt-8 text-gray-500">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">How it works:</h3>
        <ol className="list-decimal list-inside text-left max-w-md mx-auto space-y-1">
            <li>Upload a PDF document.</li>
            <li>Our AI processes the content.</li>
            <li>Ask any question about the document.</li>
            <li>Receive answers based only on the provided text.</li>
        </ol>
      </div>
    </div>
  );
};
