import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { lessons } from './lessonsData.js';

function LessonCard({ lesson, isActive, onSave }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when a new card becomes active
  useEffect(() => {
    if (!isActive) setIsFlipped(false);
  }, [isActive]);

  const handleFlip = (e) => {
    // Prevent flip if clicking on a button
    if (e.target.closest('button')) return;
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`lesson-card ${isActive ? 'active' : ''}`} id={`lesson-${lesson.id}`}>
      
      <div className={`flip-container ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        
        {/* FRONT OF CARD */}
        <div className="card-face card-front">
          <div className="lesson-content">
            <span className="category-badge">{lesson.category}</span>
            <h2 className="lesson-concept">{lesson.concept}</h2>
            
            <div className="content-section core-idea">
              <p>{lesson.coreIdea}</p>
            </div>
            
            <div className="content-section ponder-section">
              <h3>Ponder This:</h3>
              <p>{lesson.ponder}</p>
            </div>
            
            <div className="flip-hint">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4"></path>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <path d="M7 23l-4-4 4-4"></path>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>
              <span>Tap to flip for deep dive</span>
            </div>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div className="card-face card-back">
          <div className="lesson-content back-content">
            <span className="category-badge">Deep Dive</span>
            <h2 className="lesson-concept" style={{ fontSize: '1.8rem' }}>{lesson.concept}</h2>
            
            <div className="content-section extended-info">
              <p>{lesson.extendedInfo}</p>
            </div>
            
            <div className="actions" style={{ marginTop: 'auto' }}>
              <button className="btn" onClick={(e) => { e.stopPropagation(); onSave(lesson.id); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                Save
              </button>
              <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); window.open(`https://duckduckgo.com/?q=${encodeURIComponent(lesson.searchQuery)}`, '_blank'); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                Research
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Hint */}
      <div className="scroll-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
        Swipe
      </div>
    </div>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [activeId, setActiveId] = useState(lessons[0].id);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!started) return;
    
    const options = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.6
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.id.replace('lesson-', ''));
          setActiveId(id);
        }
      });
    }, options);
    
    const cards = document.querySelectorAll('.lesson-card');
    cards.forEach(card => observer.observe(card));
    
    return () => observer.disconnect();
  }, [started]);

  const handleSave = (id) => {
    alert('Insight saved! (Will be available in your mind-palace later.)');
  };

  return (
    <>
      <div className={`welcome-overlay ${started ? 'hidden' : ''}`}>
        <h1 className="welcome-title">Epiphany</h1>
        <p className="welcome-subtitle">Consume depth, not noise.</p>
        <button className="start-btn" onClick={() => setStarted(true)}>Begin Journey</button>
      </div>
      
      <div className="feed-container" ref={containerRef}>
        {lessons.map(lesson => (
          <LessonCard 
            key={lesson.id} 
            lesson={lesson} 
            isActive={activeId === lesson.id} 
            onSave={handleSave}
          />
        ))}
      </div>
    </>
  );
}

export default App;
