import { useState, useEffect } from 'react';
import { RxTextAlignTop } from 'react-icons/rx';

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 20); // Show button when scrolled down 200px
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="scroll-to-top text-center">
      {showButton && (
        <button onClick={scrollToTop} className="scroll-button">
          <RxTextAlignTop size={40} />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
