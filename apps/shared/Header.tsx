import React, { useEffect } from 'react';
import './Header.css';
import { registerServiceWorker } from './registerServiceWorker';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <header className="shared-header">
      <div className="header-content">
        <div className="header-left">
          <a href="/" className="back-button">
            <span className="back-arrow">&larr;</span>
            <span className="back-text">back</span>
          </a>
        </div>
        <div className="header-center">
          <h1 className="app-title-header">{title}</h1>
        </div>
        <div className="header-right">
          {/* Spacer to keep title centered */}
        </div>
      </div>
    </header>
  );
};

export default Header;

