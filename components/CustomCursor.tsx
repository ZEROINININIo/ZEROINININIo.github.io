import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on devices with fine pointers (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    
    const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) setIsVisible(true);
        else setIsVisible(false);
    };

    handleMediaQueryChange(mediaQuery);
    if (mediaQuery.matches) setIsVisible(true);
    
    if (!mediaQuery.matches) return;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable elements
      let target = e.target as Node | null;

      // Handle text nodes by getting parent element (e.target can be a text node)
      if (target && target.nodeType === Node.TEXT_NODE) {
          target = target.parentElement;
      }

      // Ensure target is a valid Element before calling getComputedStyle
      // nodeType 1 is ELEMENT_NODE. strict check avoids passing Document or DocumentFragment
      if (!target || target.nodeType !== 1) {
          setIsPointer(false);
          return;
      }
      
      const el = target as HTMLElement;

      try {
        // We check computed style cursor or specific tags
        const computedCursor = window.getComputedStyle(el).cursor;
        const isClickable = 
          computedCursor === 'pointer' ||
          el.tagName === 'BUTTON' ||
          el.tagName === 'A' ||
          el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.tagName === 'SELECT' ||
          el.closest('button') !== null ||
          el.closest('a') !== null;
        
        setIsPointer(isClickable);
      } catch (err) {
        // Fallback for any edge cases where getComputedStyle might fail
        setIsPointer(false);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[99999] text-white mix-blend-difference"
      style={{ 
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div className={`transition-transform duration-100 ease-out ${isClicking ? 'scale-75' : 'scale-100'}`}>
        {!isPointer ? (
            // Default State: Tactical Arrow
            <div className="-translate-x-[2px] -translate-y-[2px]">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                    <path d="M2 2L9 19L12.5 11.5L20 8L2 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
            </div>
        ) : (
            // Hover State: Dynamic Reticle
            <div className="-translate-x-1/2 -translate-y-1/2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    {/* Spinning Outer Brackets */}
                    <g className="origin-center animate-[spin_8s_linear_infinite]">
                        <path d="M4 4H9M4 4V9" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M20 4H15M20 4V9" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4 20H9M4 20V15" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M20 20H15M20 20V15" stroke="currentColor" strokeWidth="1.5" />
                    </g>
                    {/* Static Center Dot */}
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    {/* Inner Crosshair - Subtle Pulse */}
                    <g className="origin-center opacity-50">
                         <path d="M12 7V9M12 15V17M7 12H9M15 12H17" stroke="currentColor" strokeWidth="1" />
                    </g>
                </svg>
            </div>
        )}
      </div>
    </div>
  );
};

export default CustomCursor;