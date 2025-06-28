import React, { useState, useEffect, useMemo } from 'react';
import aiService from '../services/geminiService';
import DemoShowcase from './DemoShowcase';

const TextSummarizer = ({ darkMode }) => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [processingTime, setProcessingTime] = useState(0);

  const progressSteps = useMemo(() => [
    'Analyzing text...',
    'Processing with AI...',
    'Generating results...',
    'Finalizing output...'
  ], []);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgressStep(0);
      interval = setInterval(() => {
        setProgressStep(prev => {
          const next = prev + 1;
          if (next < progressSteps.length) {
            setLoadingText(progressSteps[next]);
            return next;
          }
          return prev;
        });
      }, 1000);
    } else {
      setProgressStep(0);
      setLoadingText('');
    }
    return () => clearInterval(interval);
  }, [loading, progressSteps]);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const start = Date.now();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setLoadingText(progressSteps[0]);
    
    try {
      if (activeTab === 'summary') {
        const result = await aiService.summarizeText(inputText, summaryLength);
        setSummary(result);
        const processingTimeMs = Date.now() - start;
        setProcessingTime(processingTimeMs);
        setSuccessMessage(`✨ Summary generated successfully in ${(processingTimeMs / 1000).toFixed(1)}s!`);
      } else {
        const result = await aiService.extractKeyPoints(inputText);
        setKeyPoints(result);
        const processingTimeMs = Date.now() - start;
        setProcessingTime(processingTimeMs);
        setSuccessMessage(`🎯 Key points extracted successfully in ${(processingTimeMs / 1000).toFixed(1)}s!`);
      }
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
    setKeyPoints('');
    setError('');
    setSuccessMessage('');
    setCopyFeedback(false);
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

  const handleTryDemo = (demoText, demoType) => {
    setInputText(demoText);
    setActiveTab(demoType === 'summary' ? 'summary' : 'keypoints');
    // Auto-scroll to input section
    setTimeout(() => {
      document.querySelector('.text-input')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
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

  const renderFeatureShowcase = () => (
    <div className="feature-showcase">
      <div className="feature-card">
        <div className="feature-icon">🤖</div>
        <h3>AI-Powered</h3>
        <p>Advanced Google Gemini AI for accurate summarization</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">⚡</div>
        <h3>Lightning Fast</h3>
        <p>Get results in seconds with real-time processing</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🎯</div>
        <h3>Precise Results</h3>
        <p>Extract key points and summaries with high accuracy</p>
      </div>
    </div>
  );

  return (
    <div className={`text-summarizer ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <header className="header" id="home">
          <h1>🤖 AI Text Summarizer</h1>
          <p>Powered by Advanced AI Technology</p>
        </header>

        <div className="main-content">
          <section id="features">
            {!inputText && !loading && !summary && !keyPoints && (
              <>
                {renderFeatureShowcase()}
              </>
            )}
          </section>
          
          <section id="demo">
            {!inputText && !loading && !summary && !keyPoints && (
              <DemoShowcase onTryDemo={handleTryDemo} />
            )}
          </section>
          
          <div className="input-section">
            <h2>📝 Enter your text</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type the text you want to summarize here..."
              className="text-input"
              rows={10}
            />
            
            <div className="controls">
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

              {activeTab === 'summary' && (
                <div className="length-selector">
                  <label>Summary Length:</label>
                  <select
                    value={summaryLength}
                    onChange={(e) => setSummaryLength(e.target.value)}
                    className="length-select"
                  >
                    <option value="short">📝 Short</option>
                    <option value="medium">📄 Medium</option>
                    <option value="long">📋 Long</option>
                  </select>
                </div>
              )}

              <div className="action-buttons">
                <button
                  onClick={handleSummarize}
                  disabled={loading || !inputText.trim()}
                  className={`summarize-btn ${loading ? 'loading' : ''}`}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      ✨ {activeTab === 'summary' ? 'Summarize' : 'Extract Key Points'}
                    </>
                  )}
                </button>
                <button onClick={handleClear} className="clear-btn">
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              {renderProgressIndicator()}
              <div className="loading-text">{loadingText}</div>
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

          {(summary || keyPoints) && !loading && (
            <div className="output-section">
              <div className="output-header">
                <h2>
                  {activeTab === 'summary' ? '📋 Summary' : '🎯 Key Points'}
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
        </div>
      </div>
    </div>
  );
};

export default TextSummarizer;
