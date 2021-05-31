import React, { useEffect, useRef } from 'react';

const PopupWindow = ({ isOpen, children, onClickedOutside, onInputChange }) => {
  const emojiPopup = useRef(null);

  useEffect(() => {
    const interceptLauncherClick = (e) => {
      const clickedOutside = !emojiPopup.current.contains(e.target) && isOpen;
      if (clickedOutside) {
        onClickedOutside(e);
      }
    };
    const scLauncher = document.getElementById('sc-launcher');
    scLauncher.addEventListener('click', interceptLauncherClick);
    return () => {
      scLauncher.removeEventListener('click', interceptLauncherClick);
    };
  }, []);

  return (
    <div className="sc-popup-window" ref={emojiPopup}>
      <div className={`sc-popup-window--cointainer ${isOpen ? '' : 'closed'}`}>
        <input onChange={onInputChange} className="sc-popup-window--search" placeholder="Search emoji..." />
        {children}
      </div>
    </div>
  );
};

export default PopupWindow;
