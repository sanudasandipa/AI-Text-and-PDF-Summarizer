import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onThemeToggle, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > 50);
    };

    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = 'unset';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'unset';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const navItems = [
    { name: 'Text Summarizer', path: '/', icon: '📝', isRoute: true },
    { name: 'PDF Summarizer', path: '/pdf', icon: '📄', isRoute: true },
    { name: 'Features', href: '#features', icon: '✨', isRoute: false },
    { name: 'About', href: '#about', icon: 'ℹ️', isRoute: false }
  ];

  // Dynamic opacity based on scroll position
  const navbarOpacity = Math.max(0.1, Math.min(1, scrollY / 100));

  return (
    <>
      <nav 
        className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}
        style={{
          '--navbar-opacity': navbarOpacity,
          '--scroll-progress': Math.min(scrollY / 200, 1)
        }}
      >
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                <path d="M12 16L13.09 18.26L16 19L13.09 19.74L12 22L10.91 19.74L8 19L10.91 18.26L12 16Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="brand-text">
              <span className="brand-name">Text</span>
              <span className="brand-accent">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav">
            {navItems.map((item, index) => (
              item.isRoute ? (
                <Link 
                  key={index}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.name}</span>
                  <div className="nav-indicator"></div>
                </Link>
              ) : (
                <a 
                  key={index}
                  href={item.href} 
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(item.href)?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.name}</span>
                  <div className="nav-indicator"></div>
                </a>
              )
            ))}
          </div>

          {/* Action Buttons */}
          <div className="navbar-actions">
            <button 
              className="theme-btn"
              onClick={onThemeToggle}
              aria-label="Toggle theme"
            >
              <span className="theme-icon">
                {darkMode ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.5C14.4853 17.5 16.5 15.4853 16.5 13C16.5 10.5147 14.4853 8.5 12 8.5C9.51472 8.5 7.5 10.5147 7.5 13C7.5 15.4853 9.51472 17.5 12 17.5Z" fill="currentColor"/>
                    <path d="M12 1.5V3.5M12 22.5V20.5M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1.5 12H3.5M20.5 12H22.5M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.25 12.25C20.2 17.69 15.54 21.5 10.25 20.5C4.96 19.5 1.54 14.69 2.75 9.25C3.46 6.26 5.69 4.15 8.25 3.25C9.74 2.67 11.04 2.93 11.25 4.25C11.5 5.93 10.38 7.63 8.25 8.25C5.75 9.01 4.75 11.13 5.25 13.25C5.96 16.38 9.71 18.27 12.75 16.75C15.54 15.38 16.87 12.13 15.75 9.25C15.39 8.39 15.04 7.64 14.75 7.25C14.04 6.26 14.46 5.42 15.25 5.25C17.29 4.83 19.54 6.34 20.75 8.25C21.75 9.75 21.96 11.13 21.25 12.25Z" fill="currentColor"/>
                  </svg>
                )}
              </span>
            </button>
            
            <button 
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-header">
          <div className="mobile-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                <path d="M12 16L13.09 18.26L16 19L13.09 19.74L12 22L10.91 19.74L8 19L10.91 18.26L12 16Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="brand-text">TextAI</span>
          </div>
          <button 
            className="close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        <div className="mobile-nav">
          {navItems.map((item, index) => (
            item.isRoute ? (
              <Link 
                key={index}
                to={item.path}
                className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <div className="mobile-nav-content">
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-text">{item.name}</span>
                </div>
                <svg className="mobile-nav-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ) : (
              <a 
                key={index}
                href={item.href} 
                className="mobile-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  setTimeout(() => {
                    document.querySelector(item.href)?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }, 300);
                }}
              >
                <div className="mobile-nav-content">
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-text">{item.name}</span>
                </div>
                <svg className="mobile-nav-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )
          ))}
        </div>
        
        <div className="mobile-footer">
          <button 
            className="mobile-theme-btn"
            onClick={() => {
              onThemeToggle();
              closeMenu();
            }}
          >
            <span className="theme-icon">
              {darkMode ? '☀️' : '🌙'}
            </span>
            <span className="theme-text">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="mobile-backdrop"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;
