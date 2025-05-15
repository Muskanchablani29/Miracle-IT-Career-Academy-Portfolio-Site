import React, { useEffect } from 'react';
import './Homefive.css';
import { FaCheck } from 'react-icons/fa';

export default function Homefive() {
  useEffect(() => {
    // Initialize the message animation
    const startMessageAnimation = () => {
      if (window.messageAnimationRunning) return;
      window.messageAnimationRunning = true;

      const messages = [
        { type: 'ai', text: "Hello! I'm your AI Study Assistant." },
        { type: 'ai', text: "How can I help with your studies today?" },
        { type: 'user', text: "Can you analyze my recent test scores?" },
        { type: 'ai', text: "I've analyzed your performance. Your strengths are in mathematics and science, but I notice you might need some help with literature." },
        { type: 'user', text: "What resources do you recommend for improving my literature scores?" },
        { type: 'ai', text: "Based on your learning style, I recommend these interactive literature guides and practice essays." }
      ];

      const messageContainer = document.querySelector('.message-container');
      if (!messageContainer) return;

      let currentIndex = 0;
      let visibleMessages = [];
      let isAnimating = false;

      const createTypingIndicator = () => {
        const typing = document.createElement('div');
        typing.className = 'message-bubble ai-message';
        typing.innerHTML = '<span class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></span>';
        return typing;
      };

      const typeText = async (element, text) => {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
          element.textContent += text[i];
          await new Promise(resolve => setTimeout(resolve, 30));
        }
      };

      async function addMessage() {
        if (isAnimating || !messageContainer) return;
        isAnimating = true;

        if (currentIndex < messages.length) {
          const message = messages[currentIndex];
          const messageElement = document.createElement('div');
          messageElement.className = `message-bubble ${message.type}-message`;

          if (message.type === 'ai') {
            const typing = createTypingIndicator();
            messageContainer.appendChild(typing);
            await new Promise(resolve => setTimeout(resolve, 1000));
            typing.remove();
          }

          messageContainer.appendChild(messageElement);

          if (message.type === 'ai') {
            await typeText(messageElement, message.text);
          } else {
            messageElement.textContent = message.text;
          }

          visibleMessages.push(messageElement);

          if (visibleMessages.length > 2) {
            const oldestMessage = visibleMessages.shift();
            oldestMessage.style.opacity = '0';
            oldestMessage.style.transform = 'scale(0.8)';
            setTimeout(() => oldestMessage.remove(), 500);
          }

          currentIndex++;

          if (currentIndex === messages.length) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            messageContainer.innerHTML = '';
            visibleMessages = [];
            currentIndex = 0;
          }

          isAnimating = false;
        }
      }

      addMessage();

      if (window.messageAnimationInterval) {
        clearInterval(window.messageAnimationInterval);
      }

      window.messageAnimationInterval = setInterval(async () => {
        if (!isAnimating) {
          await addMessage();
        }
      }, 3000);
    };

    // Initialize feature list animation with slide effect
    const startFeatureAnimation = () => {
      const features = document.querySelectorAll('.feature-item');
      if (!features.length) return;

      // Reset all features
      features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-100%)';
        feature.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      });

      let index = 0;
      let currentVisible = [];

      const showNextFeature = () => {
        if (index < features.length) {
          // Show new feature from right
          features[index].style.opacity = '1';
          features[index].style.transform = 'translateX(0)';
          currentVisible.push(features[index]);
          
          // If we have more than 3 visible items, remove the oldest one
          if (currentVisible.length > 3) {
            const oldestFeature = currentVisible.shift();
            oldestFeature.style.opacity = '0';
            oldestFeature.style.transform = 'translateX(-100%)';
          }
          
          index++;
          setTimeout(showNextFeature, 1200);
        } else {
          // Reset for continuous animation
          setTimeout(() => {
            features.forEach(feature => {
              feature.style.opacity = '0';
              feature.style.transform = 'translateX(-100%)';
            });
            index = 0;
            currentVisible = [];
            setTimeout(showNextFeature, 500);
          }, 2000);
        }
      };

      showNextFeature();
    };

    const cleanupAnimation = () => {
      if (window.messageAnimationInterval) {
        clearInterval(window.messageAnimationInterval);
        window.messageAnimationInterval = null;
      }
      window.messageAnimationRunning = false;
    };

    // Start animations when component mounts
    startMessageAnimation();
    setTimeout(startFeatureAnimation, 500);

    // Cleanup on unmount
    return () => cleanupAnimation();
  }, []);

  return (
    <div id="student-ai-assistant" style={{
      backgroundImage: `linear-gradient(135deg, rgba(0, 51, 102, 0.45), rgba(0, 0, 0, 0.37)), url('https://openaimaster.com/wp-content/uploads/2023/10/a-detailed-portrait-of-a-white-teacher-talking-wit-min-1600x1067.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '800px' // Increased height
    }}>
      <div className="main-heading-ai" style={{ textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>AI Assistant</div>
      <div className="ai-description">
        <p>Your intelligent companion for learning, productivity, and problem-solving. Powered by advanced machine learning algorithms, our AI Assistant adapts to your needs and provides personalized support for all your tasks.</p>
      </div>
      <div className="assistant-container" style={{ height: '650px' }}> {/* Increased container height */}
        <div className="animation-side" style={{ flex: '1.3' }}> {/* Enlarged animation side */}
          <div className="ai-interface" style={{ transform: 'scale(1.2)', transformOrigin: 'center center' }}> {/* Enlarged animation */}
            <div className="circle-container">
              <div className="orbital-circle"></div>
              <div className="orbital-circle"></div>
              <div className="orbital-circle"></div>
              <div className="particle" style={{ top: 0, left: '50%' }}></div>
              <div className="particle" style={{ bottom: 0, left: '50%' }}></div>
              <div className="particle" style={{ left: 0, top: '50%' }}></div>
              <div className="particle" style={{ right: 0, top: '50%' }}></div>
              <div className="particle" style={{ top: '25%', right: '25%' }}></div>
              <div className="particle" style={{ bottom: '25%', left: '25%' }}></div>
            </div>
            <div className="center-core">
              <div className="core-icon"></div>
            </div>
            <div className="message-container"></div>
          </div>
        </div>
        <div className="content-side">
          <h1 className="assistant-heading" style={{ textAlign: 'center', width: '100%' }}>Student AI Assistant</h1>
          <ul className="feature-list" style={{ maxHeight: 'fit-content', overflowY: 'hidden' }}>
            <li className="feature-item" style={{ maxWidth: '90%', animation: 'fadeRotate 0.7s forwards', transformOrigin: 'top' }}> {/* Reduced card width */}
              <span className="check-icon"><FaCheck /></span>
              <div className="feature-content">
                <span className="feature-text">Performance Analysis & Insights</span>
                <p className="feature-description">Get detailed analysis of your academic performance with actionable insights.</p>
              </div>
            </li>
            <li className="feature-item" style={{ maxWidth: '90%', animation: 'fadeRotate 0.7s 0.2s forwards', transformOrigin: 'top', opacity: 0 }}> {/* Reduced card width */}
              <span className="check-icon"><FaCheck /></span>
              <div className="feature-content">
                <span className="feature-text">Personalized Study Plans</span>
                <p className="feature-description">Custom learning paths tailored to your learning style and goals.</p>
              </div>
            </li>
            <li className="feature-item" style={{ maxWidth: '90%', animation: 'fadeRotate 0.7s 0.4s forwards', transformOrigin: 'top', opacity: 0 }}> {/* Reduced card width */}
              <span className="check-icon"><FaCheck /></span>
              <div className="feature-content">
                <span className="feature-text">24/7 Learning Support</span>
                <p className="feature-description">Round-the-clock assistance whenever you need help with your studies.</p>
              </div>
            </li>
            <li className="feature-item" style={{ maxWidth: '90%', animation: 'fadeRotate 0.7s 0.6s forwards', transformOrigin: 'top', opacity: 0 }}> {/* Reduced card width */}
              <span className="check-icon"><FaCheck /></span>
              <div className="feature-content">
                <span className="feature-text">AI-Powered Study Recommendations</span>
                <p className="feature-description">Smart resource suggestions based on your learning patterns.</p>
              </div>
            </li>
            <li className="feature-item" style={{ maxWidth: '90%', animation: 'fadeRotate 0.7s 0.8s forwards', transformOrigin: 'top', opacity: 0 }}> {/* Reduced card width */}
              <span className="check-icon"><FaCheck /></span>
              <div className="feature-content">
                <span className="feature-text">Interactive Learning Exercises</span>
                <p className="feature-description">Engage with dynamic content that adapts to your progress.</p>
              </div>
            </li>
            <li className="feature-item" style={{ maxWidth: '90%', animation: 'fadeRotate 0.7s 1s forwards', transformOrigin: 'top', opacity: 0 }}> {/* Reduced card width */}
              <span className="check-icon"><FaCheck /></span>
              <div className="feature-content">
                <span className="feature-text">Progress Tracking Dashboard</span>
                <p className="feature-description">Visualize your improvement with comprehensive analytics.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}