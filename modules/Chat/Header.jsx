import React from 'react';

const Header = ({ headerName, onClose }) => {
  return (
    <div className="sc-header">
      <div className="sc-header--team-name"> {headerName} </div>
      <div className="sc-header--close-button" onClick={onClose}>
        <img src="/chat/close-icon.png" alt="close icon" />
      </div>
    </div>
  );
};

export default Header;
