import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import aiService from '../services/geminiService';

// Set up PDF.js worker using local file from public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFSummarizer = ({ darkMode }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryMode, setSummaryMode] = useState('general');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [fileInfo, setFileInfo] = useState(null);

  const progressSteps = [
    'Reading PDF...',
    'Extracting text...',
    'Processing with AI...',
    'Generating results...'
  ];

  const summaryModes = [
    { value: 'general', label: '📄 General Summary', description: 'Overall summary of the document' },
    { value: 'academic', label: '🎓 Academic Focus', description: 'Focus on research, methodology, and conclusions' },
    { value: 'business', label: '💼 Business Focus', description: 'Focus on business implications and actionable insights' },
    { value: 'technical', label: '⚙️ Technical Focus', description: 'Focus on technical details and specifications' },
    { value: 'executive', label: '👔 Executive Summary', description: 'High-level overview for decision makers' }
  ];

  useEffect(() => {
    let interval;
    if (loading || extracting) {
      setProgressStep(0);
      interval = setInterval(() => {
        setProgressStep(prev => {
          const next = prev + 1;
          if (next < progressSteps.length) {
            return next;
          }
          return prev;
        });
      }, 1000);
    } else {
      setProgressStep(0);
    }
    return () => clearInterval(interval);
  }, [loading, extracting, progressSteps.length]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // MB
        lastModified: new Date(file.lastModified).toLocaleDateString()
      });
      setExtractedText('');
      setSummary('');
      setKeyPoints('');
      setError('');
    } else {
      setError('Please select a valid PDF file.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      setExtracting(true);
      setProgressStep(0);
      
      const arrayBuffer = await file.arrayBuffer();
      
      // Use a simpler loading approach without external dependencies
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
      });
      
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      const totalPages = pdf.numPages;
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .filter(item => item.str && item.str.trim()) // Filter out empty strings
            .map(item => item.str)
            .join(' ');
          
          if (pageText.trim()) {
            fullText += pageText + '\n\n';
          }
          
          // Update progress
          setProgressStep(1);
        } catch (pageError) {
          console.warn(`Error extracting text from page ${pageNum}:`, pageError);
          // Continue with other pages
        }
      }
      
      const cleanText = fullText.trim();
      if (!cleanText) {
        throw new Error('No readable text found in the PDF. This might be a scanned document or image-based PDF.');
      }
      
      setExtractedText(cleanText);
      setFileInfo(prev => ({ 
        ...prev, 
        pages: totalPages, 
        wordCount: cleanText.split(/\s+/).filter(word => word.length > 0).length 
      }));
      return cleanText;
    } catch (err) {
      console.error('Error extracting text from PDF:', err);
      if (err.message.includes('No readable text')) {
        throw err;
      } else {
        throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted and try a different PDF.');
      }
    } finally {
      setExtracting(false);
    }
  };

  const handleProcessPDF = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const start = Date.now();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(selectedFile);
      
      if (!text.trim()) {
        throw new Error('No text found in the PDF. The file might be image-based or encrypted.');
      }

      setProgressStep(2);
      
      // Process with AI based on active tab
      if (activeTab === 'summary') {
        const result = await aiService.summarizePDF(text, summaryLength, summaryMode);
        setSummary(result);
      } else {
        const result = await aiService.extractPDFKeyPoints(text, summaryMode);
        setKeyPoints(result);
      }
      
      const processingTimeMs = Date.now() - start;
      setProcessingTime(processingTimeMs);
      setSuccessMessage(`✨ ${activeTab === 'summary' ? 'Summary' : 'Key points'} generated successfully in ${(processingTimeMs / 1000).toFixed(1)}s!`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setExtractedText('');
    setSummary('');
    setKeyPoints('');
    setError('');
    setSuccessMessage('');
    setCopyFeedback(false);
    setFileInfo(null);
    // Reset file input
    const fileInput = document.getElementById('pdf-file-input');
    if (fileInput) fileInput.value = '';
  };

  const handleCopyResult = async () => {
    const textToCopy = activeTab === 'summary' ? summary : keyPoints;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
      setTimeout(() => setError(''), 3000);
    }
  };

  const renderProgressIndicator = () => (
    <div className="progress-indicator">
      {progressSteps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="progress-step">
            <div className={`progress-circle ${index <= progressStep ? 'active' : ''} ${index < progressStep ? 'completed' : ''}`}>
              {index < progressStep ? '✓' : index + 1}
            </div>
            <span style={{ fontSize: '12px', color: index <= progressStep ? '#4facfe' : '#ccc' }}>
              {step.split(' ')[0]}
            </span>
          </div>
          {index < progressSteps.length - 1 && (
            <div className={`progress-line ${index < progressStep ? 'active' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderFilePreview = () => {
    if (!fileInfo) return null;
    
    return (
      <div className="file-preview">
        <div className="file-icon">📄</div>
        <div className="file-details">
          <h4>{fileInfo.name}</h4>
          <div className="file-stats">
            <span>📊 {fileInfo.size} MB</span>
            {fileInfo.pages && <span>📑 {fileInfo.pages} pages</span>}
            {fileInfo.wordCount && <span>📝 {fileInfo.wordCount} words</span>}
            <span>📅 {fileInfo.lastModified}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`pdf-summarizer ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <header className="pdf-header">
          <h1>📄 PDF Summarizer</h1>
          <p>Upload any PDF document and get AI-powered summaries and insights</p>
        </header>

        <div className="pdf-content">
          <div className="upload-section">
            <h2>📤 Upload PDF Document</h2>
            <div className="file-upload-area">
              <input
                type="file"
                id="pdf-file-input"
                accept=".pdf"
                onChange={handleFileSelect}
                className="file-input"
              />
              <label htmlFor="pdf-file-input" className="file-upload-label">
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                  <span>Choose PDF file or drag and drop</span>
                  <small>Supports PDF documents up to 10MB</small>
                </div>
              </label>
            </div>
            
            {renderFilePreview()}
          </div>

          {selectedFile && (
            <div className="controls-section">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  📋 Summary
                </button>
                <button
                  className={`tab ${activeTab === 'keypoints' ? 'active' : ''}`}
                  onClick={() => setActiveTab('keypoints')}
                >
                  🎯 Key Points
                </button>
              </div>

              <div className="options-grid">
                {activeTab === 'summary' && (
                  <div className="option-group">
                    <label>Summary Length:</label>
                    <select
                      value={summaryLength}
                      onChange={(e) => setSummaryLength(e.target.value)}
                      className="option-select"
                    >
                      <option value="short">📝 Short (2-3 sentences)</option>
                      <option value="medium">📄 Medium (1-2 paragraphs)</option>
                      <option value="long">📋 Long (3-4 paragraphs)</option>
                    </select>
                  </div>
                )}

                <div className="option-group">
                  <label>Analysis Mode:</label>
                  <select
                    value={summaryMode}
                    onChange={(e) => setSummaryMode(e.target.value)}
                    className="option-select"
                  >
                    {summaryModes.map(mode => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                  <small className="option-description">
                    {summaryModes.find(mode => mode.value === summaryMode)?.description}
                  </small>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleProcessPDF}
                  disabled={loading || extracting || !selectedFile}
                  className={`process-btn ${loading || extracting ? 'loading' : ''}`}
                >
                  {loading || extracting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      ✨ {activeTab === 'summary' ? 'Generate Summary' : 'Extract Key Points'}
                    </>
                  )}
                </button>
                <button onClick={handleClear} className="clear-btn">
                  🗑️ Clear All
                </button>
              </div>
            </div>
          )}

          {(loading || extracting) && (
            <div className="loading-container">
              {renderProgressIndicator()}
              <div className="loading-text">
                {progressSteps[progressStep] || 'Processing...'}
              </div>
              <div className="loading-progress"></div>
            </div>
          )}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {(summary || keyPoints) && !loading && !extracting && (
            <div className="output-section">
              <div className="output-header">
                <h2>
                  {activeTab === 'summary' ? '📋 PDF Summary' : '🎯 Key Points'}
                </h2>
                <div className="output-actions">
                  <div className="performance-stats">
                    <span className="word-count">
                      📊 {(activeTab === 'summary' ? summary : keyPoints).split(' ').length} words
                    </span>
                    {processingTime > 0 && (
                      <span className="processing-time">
                        ⚡ {(processingTime / 1000).toFixed(1)}s
                      </span>
                    )}
                    <span className="mode-indicator">
                      {summaryModes.find(mode => mode.value === summaryMode)?.label}
                    </span>
                  </div>
                  <button 
                    onClick={handleCopyResult} 
                    className={`copy-btn ${copyFeedback ? 'copied' : ''}`}
                  >
                    {copyFeedback ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>
              <div className="output-text">
                {activeTab === 'summary' ? summary : keyPoints}
              </div>
            </div>
          )}

          {extractedText && !loading && !extracting && (
            <div className="extracted-text-section">
              <details>
                <summary>📄 View Extracted Text ({extractedText.split(' ').length} words)</summary>
                <div className="extracted-text">
                  {extractedText}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFSummarizer;
