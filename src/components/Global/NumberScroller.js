import React, { useState, useRef, useEffect } from 'react';

const Scroller = ({
  start = 1,
  end = 10,
  onChange,
  initialValue = 1
}) => {
  const [value, setValue] = useState(initialValue);
  const scrollRef = useRef(null);

  // Adjust scroll position when the value changes
  useEffect(() => {
    if (scrollRef.current) {
      const itemHeight = 30;
      const index = value - start;
      scrollRef.current.scrollTop = index * itemHeight;
    }
  }, [value, start]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    const itemHeight = 30;
    const index = Math.round(scrollTop / itemHeight);
    const newValue = Math.max(start, Math.min(index + start, end));
    setValue(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (!scrollRef.current) return;
      e.preventDefault();
      const scrollHeight = scrollRef.current.scrollHeight;
      const maxScrollTop = scrollHeight - scrollRef.current.clientHeight;
      let newScrollTop = scrollRef.current.scrollTop + (e.deltaY > 0 ? 30 : -30);
      newScrollTop = Math.max(0, Math.min(newScrollTop, maxScrollTop));

      scrollRef.current.scrollTop = newScrollTop;
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleIncrement = () => {
    if (value < end) {
      const newValue = value + 1;
      setValue(newValue);
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (value > start) {
      const newValue = value - 1;
      setValue(newValue);
      onChange(newValue);
    }
  };
  return (
    <div className="scroller-component">
      <div className="d-flex align-items-center">
        <button className="btn p-1" type="button" onClick={handleDecrement}>-</button>
        <div className="scroll-container" ref={scrollRef} onScroll={handleScroll}>
          <div style={{ height: `${(end - start + 1) * 30}px` }}>
            {[...Array(end - start + 1)].map((_, i) => (
              <div
                key={i}
                className={`scroll-item ${i + start === value ? 'selected' : ''}`}
              >
                {i + start}
              </div>
            ))}
          </div>
        </div>
        <button className="btn p-1" type="button" onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
};

export default Scroller;
