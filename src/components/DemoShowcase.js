import React, { useState, useEffect } from 'react';

const DemoShowcase = ({ onTryDemo }) => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const demoTexts = [
    {
      title: "📰 News Article",
      text: "Artificial Intelligence has revolutionized many industries in recent years. From healthcare to finance, AI technologies are being implemented to improve efficiency, accuracy, and decision-making processes. Machine learning algorithms can now analyze vast amounts of data in real-time, providing insights that were previously impossible to obtain. However, with these advancements come important considerations about ethics, privacy, and the future of work.",
      type: "summary"
    },
    {
      title: "📚 Academic Text",
      text: "Climate change represents one of the most significant challenges facing humanity in the 21st century. Rising global temperatures, melting ice caps, and extreme weather events are just some of the manifestations of this phenomenon. The primary cause is the increased concentration of greenhouse gases in the atmosphere, particularly carbon dioxide from fossil fuel combustion. Scientists worldwide are working on solutions including renewable energy technologies, carbon capture methods, and sustainable development practices.",
      type: "keypoints"
    },
    {
      title: "💼 Business Report",
      text: "The quarterly financial results show significant growth across all major sectors. Revenue increased by 15% compared to the previous quarter, driven primarily by strong performance in the technology and healthcare divisions. Customer acquisition costs decreased by 8%, while customer lifetime value improved by 12%. The company's digital transformation initiatives have contributed to operational efficiency gains of approximately 20%. Moving forward, the focus will be on expanding into emerging markets and investing in research and development.",
      type: "summary"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoTexts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleTryDemo = (demo) => {
    setIsTyping(true);
    onTryDemo(demo.text, demo.type);
    setTimeout(() => setIsTyping(false), 1000);
  };

  return (
    <div className="demo-showcase">
      <div className="demo-header">
        <h3>🎯 Try These Examples</h3>
        <p>See how AI summarization works with different types of content</p>
      </div>
      
      <div className="demo-cards">
        {demoTexts.map((demo, index) => (
          <div 
            key={index}
            className={`demo-card ${index === currentDemo ? 'active' : ''} ${isTyping ? 'typing' : ''}`}
          >
            <div className="demo-card-header">
              <h4>{demo.title}</h4>
              <span className="demo-type">{demo.type === 'summary' ? '📋' : '🎯'}</span>
            </div>
            <div className="demo-text">
              {demo.text.substring(0, 120)}...
            </div>
            <button 
              className="demo-try-btn"
              onClick={() => handleTryDemo(demo)}
            >
              Try This Example ✨
            </button>
          </div>
        ))}
      </div>
      
      <div className="demo-indicators">
        {demoTexts.map((_, index) => (
          <div 
            key={index}
            className={`demo-indicator ${index === currentDemo ? 'active' : ''}`}
            onClick={() => setCurrentDemo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default DemoShowcase;
